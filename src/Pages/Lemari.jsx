import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getStorage, ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import Modal from "@mui/material/Modal";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSpring, animated } from "@react-spring/web";

const Carousel = () => {
  const [files, setFiles] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const modalFade = useSpring({
    opacity: open ? 1 : 0,
    config: { duration: 300 },
  });

  const fetchFilesFromFirebase = async () => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, "Lemari/");
      const filesList = await listAll(storageRef);

      const filesData = await Promise.all(
        filesList.items.map(async (item) => {
          const url = await getDownloadURL(item);
          const metadata = await getMetadata(item);
          return { url, name: metadata.name };
        })
      );

      setFiles(filesData);
    } catch (error) {
      console.error("Error fetching files from Firebase Storage:", error);
    }
  };

  useEffect(() => {
    fetchFilesFromFirebase();
  }, []);

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedFile(null);
  };

  const settings = {
    centerMode: true,
    centerPadding: "30px",
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: "50px",
          slidesToShow: 1,
          dots: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: "70px",
          slidesToShow: 1,
          dots: false,
        },
      },
    ],
  };

  return (
    <>
      <div className="text-white opacity-60 text-base font-semibold mb-4 mx-[10%] mt-10 lg:text-center lg:text-3xl lg:mb-8" id="Gallery">
        Public Files
      </div>
      <div id="Carousel">
        <Slider {...settings}>
          {files.map((file, index) => (
            <div key={index} onClick={() => handleFileClick(file)} style={{ cursor: "pointer" }}>
              <p>{file.name}</p>
            </div>
          ))}
        </Slider>
      </div>

      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="file-modal"
        aria-describedby="file-modal-description"
        className="flex justify-center items-center"
      >
        <animated.div
          style={{
            ...modalFade,
            maxWidth: "90vw",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
          className="p-2 rounded-lg"
        >
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseModal}
            aria-label="close"
            sx={{
              position: "absolute",
              top: "12px",
              right: "23px",
              backgroundColor: "white",
              borderRadius: "50%",
            }}
          >
            <CloseIcon />
          </IconButton>
          <div className="w-full">
            <a href={selectedFile && selectedFile.url} download>
              Download File
            </a>
          </div>
        </animated.div>
      </Modal>
    </>
  );
};

export default Carousel;
