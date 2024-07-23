import React, { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import LinearProgress from "@mui/material/LinearProgress";
import { getStorage, ref, listAll, getDownloadURL, getMetadata, uploadBytesResumable } from "firebase/storage";
import { getDatabase, ref as dbRef, set as dbSet, get as dbGet } from "firebase/database";

export default function ButtonLemari() {
    const [open, setOpen] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [newFile, setNewFile] = useState(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setUploadSuccess(false);
    };

    const fade = useSpring({
        opacity: open ? 1 : 0,
        config: {
            duration: 200,
        },
    });

    useEffect(() => {
        fetchFilesFromFirebase();
        fetchFoldersFromFirebase();
    }, []);

    const fetchFilesFromFirebase = async () => {
        try {
            const storage = getStorage();
            const storageRef = ref(storage, "Lemari/");

            const filesList = await listAll(storageRef);

            const filePromises = filesList.items.map(async (item) => {
                const url = await getDownloadURL(item);
                const metadata = await getMetadata(item);

                return {
                    url,
                    name: metadata.name,
                    size: metadata.size,
                };
            });

            const fileURLs = await Promise.all(filePromises);
            fileURLs.sort((a, b) => a.timestamp - b.timestamp);
            setFiles(fileURLs);
        } catch (error) {
            console.error("Error fetching files from Firebase Storage:", error);
        }
    };

    const fetchFoldersFromFirebase = async () => {
        try {
            const db = getDatabase();
            const foldersRef = dbRef(db, 'folderMetadata');

            const snapshot = await dbGet(foldersRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                const folderList = Object.keys(data).map(folderName => ({
                    name: folderName,
                    metadata: data[folderName]
                }));
                setFolders(folderList);
            } else {
                console.log("No folder metadata available");
            }
        } catch (error) {
            console.error("Error fetching folders from Firebase Realtime Database:", error);
        }
    };

    const handleFileChange = (event) => {
        setNewFile(event.target.files[0]);
    };

    const handleUpload = () => {
        if (!newFile) return;

        const storage = getStorage();
        const storageRef = ref(storage, `Lemari/${newFile.name}`);

        const uploadTask = uploadBytesResumable(storageRef, newFile);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setUploadProgress(progress);
            },
            (error) => {
                console.error("Error saat mengunggah file:", error);
            },
            () => {
                setUploadSuccess(true);
                fetchFilesFromFirebase();
                setNewFile(null);
                setUploadProgress(0);
            }
        );
    };

    return (
        <div>
            <button onClick={handleOpen} className="text-white opacity-95 text-[1rem] font-semibold" id="ButtonLemariNav">
                <span className="text-base lg:text-1xl">Lemari</span>
            </button>

            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <animated.div style={fade}>
                    <Box className="modal-container">
                        <CloseIcon style={{ position: "absolute", top: "10px", right: "10px", cursor: "pointer", color: "grey" }} onClick={handleClose} />
                        <Typography id="spring-modal-description" sx={{ mt: 2 }}>
                            <h6 className="text-center text-white text-2xl mb-5">Lemari</h6>
                            <div className="h-[22rem] overflow-y-scroll overflow-y-scroll-no-thumb">
                                {files.map((file, index) => (
                                    <div key={index} className="flex justify-between items-center px-5 py-2 mt-2" id="LayoutIsiButtonRequest">
                                        <a href={file.url} target="_blank" rel="noreferrer" className="text-white">{file.name}</a>
                                        <span className="ml-2 text-white">{formatBytes(file.size)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="text-white text-[0.7rem] mt-5">
                                <input type="file" onChange={handleFileChange} />
                                <button onClick={handleUpload} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Unggah File
                                </button>
                            </div>
                            {uploadSuccess && (
                                <Typography variant="subtitle1" className="text-green-500 mt-2">
                                    File berhasil diunggah!
                                </Typography>
                            )}
                            {uploadProgress > 0 && <LinearProgress variant="buffer" value={uploadProgress} />}
                        </Typography>
                    </Box>
                </animated.div>
            </Modal>
        </div>
    );
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
