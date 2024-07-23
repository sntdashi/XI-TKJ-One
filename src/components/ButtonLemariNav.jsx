import React, { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import LinearProgress from "@mui/material/LinearProgress"; // Import LinearProgress dari Material-UI
import { getStorage, ref, listAll, getDownloadURL, getMetadata, uploadBytesResumable, createFolder } from "firebase/storage"; // Tambahkan createFolder dari firebase storage
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

export default function ButtonLemari() {
    const [open, setOpen] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0); // State untuk melacak kemajuan unggah
    const [uploadSuccess, setUploadSuccess] = useState(false); // State untuk menampilkan pesan sukses
    const [currentFolder, setCurrentFolder] = useState("Lemari"); // State untuk menyimpan nama folder yang sedang dibuka
    const [newFile, setNewFile] = useState(null);
    const [newFolderName, setNewFolderName] = useState(""); // State untuk menyimpan nama folder baru
    const [showAddFolder, setShowAddFolder] = useState(false); // State untuk menunjukkan form tambah folder baru

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        // Setelah menutup modal, reset pesan sukses
        setUploadSuccess(false);
        setNewFolderName(""); // Reset input nama folder baru
        setShowAddFolder(false); // Reset state untuk form tambah folder baru
    };

    const fade = useSpring({
        opacity: open ? 1 : 0,
        config: {
            duration: 200,
        },
    });

    // Fungsi untuk mengambil daftar file dari Firebase Storage
    const fetchFilesFromFirebase = async (folder) => {
        try {
            const storage = getStorage();
            const storageRef = ref(storage, folder + '/');

            const filesList = await listAll(storageRef);

            const filePromises = filesList.items.map(async (item) => {
                const url = await getDownloadURL(item);
                const metadata = await getMetadata(item);

                return {
                    url,
                    name: metadata.name,
                    size: metadata.size, // Tambahkan ukuran file
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
        fetchFilesFromFirebase(currentFolder);
    }, [currentFolder]);

    const handleFileChange = (event) => {
        setNewFile(event.target.files[0]);
    };

    const handleUpload = () => {
        if (!newFile) return;

        const storage = getStorage();
        const storageRef = ref(storage, `${currentFolder}/${newFile.name}`);

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
                // Setelah berhasil diunggah, atur state untuk menampilkan pesan sukses
                setUploadSuccess(true);
                fetchFilesFromFirebase(currentFolder);
                setNewFile(null);
                setUploadProgress(0);
            }
        );
    };

    const handleFolderClick = (folderName) => {
        setCurrentFolder(folderName);
    };

    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return;

        try {
            const storage = getStorage();
            const folderRef = ref(storage, currentFolder + '/' + newFolderName);
            await createFolder(folderRef);
            fetchFilesFromFirebase(currentFolder); // Muat ulang file setelah membuat folder baru
            setNewFolderName(""); // Reset input nama folder baru
            setShowAddFolder(false); // Sembunyikan form tambah folder setelah berhasil
        } catch (error) {
            console.error("Error creating folder:", error);
        }
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
                            <h6 className="text-center text-white text-2xl mb-5">{currentFolder}</h6>
                            <div className="h-[22rem] overflow-y-scroll overflow-y-scroll-no-thumb">
                                {files.map((file, index) => (
                                    <div key={index} className="flex justify-between items-center px-5 py-2 mt-2" id="LayoutIsiButtonRequest">
                                        <a href={file.url} target="_blank" rel="noreferrer" className="text-white">{file.name}</a>
                                        <span className="ml-2 text-white">{formatBytes(file.size)}</span> {/* Tampilkan ukuran file */}
                                    </div>
                                ))}
                            </div>
                            <div className="text-white text-[0.7rem] mt-5">
                                <input type="file" onChange={handleFileChange} />
                                <button onClick={handleUpload} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Unggah File
                                </button>
                            </div>
                            {/* Tampilkan pesan sukses jika file berhasil diunggah */}
                            {uploadSuccess && (
                                <Typography variant="subtitle1" className="text-green-500 mt-2">
                                    File berhasil diunggah!
                                </Typography>
                            )}
                            {/* Tampilkan progress bar saat sedang mengunggah */}
                            {uploadProgress > 0 && <LinearProgress variant="buffer" value={uploadProgress} />}

                            {/* Input untuk membuat folder baru */}
                            {showAddFolder ? (
                                <div className="mt-4 flex items-center">
                                    <input
                                        type="text"
                                        value={newFolderName}
                                        onChange={(e) => setNewFolderName(e.target.value)}
                                        placeholder="Nama Folder Baru"
                                        className="border rounded px-2 py-1 mr-2"
                                    />
                                    <button onClick={handleCreateFolder} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                        Buat
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-4">
                                    <IconButton onClick={() => setShowAddFolder(true)}>
                                        <AddCircleOutlineOutlinedIcon />
                                    </IconButton>
                                    <span className="ml-2 text-white cursor-pointer" onClick={() => setShowAddFolder(true)}>Tambah Folder Baru</span>
                                </div>
                            )}
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
