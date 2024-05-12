import React, { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import LinearProgress from "@mui/material/LinearProgress"; // Import LinearProgress dari Material-UI
import { getStorage, ref, listAll, getDownloadURL, getMetadata, uploadBytesResumable } from "firebase/storage";

export default function ButtonLemari() {
    const [open, setOpen] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0); // State untuk melacak kemajuan unggah
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const fade = useSpring({
        opacity: open ? 1 : 0,
        config: {
            duration: 200,
        },
    });

    const [files, setFiles] = useState([]);
    const [newFile, setNewFile] = useState(null);

    // Fungsi untuk mengambil daftar file dari Firebase Storage
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
                    timestamp: metadata.timeCreated,
                };
            });

            const fileURLs = await Promise.all(filePromises);

            // Urutkan array berdasarkan timestamp (dari yang terlama)
            fileURLs.sort((a, b) => a.timestamp - b.timestamp);

            setFiles(fileURLs);
        } catch (error) {
            console.error("Error fetching files from Firebase Storage:", error);
        }
    };

    useEffect(() => {
        fetchFilesFromFirebase();
    }, []);

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
                console.log("File berhasil diunggah");
                fetchFilesFromFirebase();
                setNewFile(null);
                setUploadProgress(0);
            }
        );
    };

    return (
        <div>
            <button onClick={handleOpen} className="flex items-center space-x-2 text-white px-6 py-4" id="ButtonLemari">
                <img src="/Folder.png" alt="Icon" className="w-6 h-6 relative bottom-1" />
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
                                        <span className="ml-2 text-white">{new Date(file.timestamp).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="text-white text-[0.7rem] mt-5">
                                <input type="file" onChange={handleFileChange} />
                                <button onClick={handleUpload} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Unggah File
                                </button>
                            </div>
                            {/* Tampilkan progress bar saat sedang mengunggah */}
                            {uploadProgress > 0 && <LinearProgress variant="determinate" value={uploadProgress} />}
                        </Typography>
                    </Box>
                </animated.div>
            </Modal>
        </div>
    );
}
