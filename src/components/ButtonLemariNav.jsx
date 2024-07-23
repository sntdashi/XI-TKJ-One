import React, { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import LinearProgress from "@mui/material/LinearProgress";
import { storage as firebaseStorage, ref as storageRef, listAll as listAllFiles, getDownloadURL as getDownloadFileURL, getMetadata as getFileMetadata, uploadBytesResumable as uploadFileBytesResumable } from "firebase/storage";
import { db, ref as dbRef, set as dbSet, get as dbGet } from "./firebaseConfig"; // Mengimpor instance firebaseApp dan firebase database

export default function FolderButton() {
    const [open, setOpen] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [newFile, setNewFile] = useState(null);
    const [newFolderName, setNewFolderName] = useState("");

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
            const storage = firebaseStorage();
            const storageRef = storageRef(storage, "files/");

            const filesList = await listAllFiles(storageRef);

            const filePromises = filesList.items.map(async (item) => {
                const url = await getDownloadFileURL(item);
                const metadata = await getFileMetadata(item);

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
            const foldersRef = dbRef(db, 'folders');

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

        const storage = firebaseStorage();
        const storageRef = storageRef(storage, `files/${newFile.name}`);

        const uploadTask = uploadFileBytesResumable(storageRef, newFile);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setUploadProgress(progress);
            },
            (error) => {
                console.error("Error uploading file:", error);
            },
            () => {
                setUploadSuccess(true);
                fetchFilesFromFirebase();
                setNewFile(null);
                setUploadProgress(0);
            }
        );
    };

    const handleCreateFolder = async () => {
        if (!newFolderName) return;

        try {
            const foldersRef = dbRef(db, `folders/${newFolderName}`);
            await dbSet(foldersRef, {
                createdAt: new Date().toISOString(),
                createdBy: "public" // ganti dengan user ID atau informasi pengguna yang sesuai
            });
            setNewFolderName("");
            fetchFoldersFromFirebase();
        } catch (error) {
            console.error("Error creating folder:", error);
        }
    };

    return (
        <div>
            <button onClick={handleOpen} className="text-white opacity-95 text-[1rem] font-semibold" id="FolderButton">
                <span className="text-base lg:text-1xl">Folder</span>
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
                            <h6 className="text-center text-white text-2xl mb-5">Folder</h6>
                            <div>
                                {/* Menampilkan daftar folder */}
                                {folders.map((folder, index) => (
                                    <div key={index} className="flex justify-between items-center px-5 py-2 mt-2">
                                        <span className="text-white">{folder.name}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="text-white text-[0.7rem] mt-5">
                                {/* Form untuk membuat folder */}
                                <input type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="Nama Folder" />
                                <button onClick={handleCreateFolder} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Buat Folder
                                </button>
                            </div>
                            <div className="text-white text-[0.7rem] mt-5">
                                {/* Form untuk mengunggah file */}
                                <input type="file" onChange={handleFileChange} />
                                <button onClick={handleUpload} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Unggah File
                                </button>
                            </div>
                            {/* Pesan sukses saat file berhasil diunggah */}
                            {uploadSuccess && (
                                <Typography variant="subtitle1" className="text-green-500 mt-2">
                                    File berhasil diunggah!
                                </Typography>
                            )}
                            {/* Progress bar saat sedang mengunggah */}
                            {uploadProgress > 0 && <LinearProgress variant="buffer" value={uploadProgress} />}
                        </Typography>
                    </Box>
                </animated.div>
            </Modal>
        </div>
    );
};