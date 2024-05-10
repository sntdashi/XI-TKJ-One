// Lemari.js

import React, { useEffect, useState } from "react";
import { getStorage, ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";

const Lemari = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFilesFromFirebase = async () => {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, "lemari/");
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

    fetchFilesFromFirebase();
  }, []);

  return (
    <div>
      <h1>Lemari</h1>
      <div>
        {files.map((file, index) => (
          <div key={index}>
            <p>{file.name}</p>
            <a href={file.url} download>Download</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lemari;
