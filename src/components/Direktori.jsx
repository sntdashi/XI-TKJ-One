import React, { useState } from 'react';

// Contoh data folder dan file
const dataDirektori = [
  {
    nama: 'Folder 1',
    type: 'folder',
    konten: [
      { nama: 'File1.txt', type: 'file' },
      { nama: 'File2.txt', type: 'file' },
    ],
  },
  {
    nama: 'Folder 2',
    type: 'folder',
    konten: [
      { nama: 'FileA.txt', type: 'file' },
      { nama: 'FileB.txt', type: 'file' },
    ],
  },
];

const Direktori = () => {
  const [direktori, setDirektori] = useState(dataDirektori);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [editingFolderIndex, setEditingFolderIndex] = useState(null);

  // Menangani klik folder untuk expand
  const handleClick = (folderIndex) => {
    const newDirektori = [...direktori];
    newDirektori[folderIndex].konten = newDirektori[folderIndex].konten || [];
    setDirektori(newDirektori);
  };

  // Menambahkan folder baru
  const addFolder = () => {
    if (newFolderName) {
      const newDirektori = [
        ...direktori,
        { nama: newFolderName, type: 'folder', konten: [] },
      ];
      setDirektori(newDirektori);
      setNewFolderName('');
    }
  };

  // Mengedit nama folder
  const editFolder = (folderIndex) => {
    const updatedDirektori = [...direktori];
    updatedDirektori[folderIndex].nama = newFolderName;
    setDirektori(updatedDirektori);
    setNewFolderName('');
    setEditingFolderIndex(null);
  };

  // Menambahkan file ke folder tertentu
  const addFileToFolder = (folderIndex) => {
    if (newFileName) {
      const updatedDirektori = [...direktori];
      updatedDirektori[folderIndex].konten.push({
        nama: newFileName,
        type: 'file',
      });
      setDirektori(updatedDirektori);
      setNewFileName('');
    }
  };

  // Menghapus folder
  const deleteFolder = (folderIndex) => {
    const updatedDirektori = [...direktori];
    updatedDirektori.splice(folderIndex, 1);
    setDirektori(updatedDirektori);
  };

  // Menghapus file
  const deleteFile = (folderIndex, fileIndex) => {
    const updatedDirektori = [...direktori];
    updatedDirektori[folderIndex].konten.splice(fileIndex, 1);
    setDirektori(updatedDirektori);
  };

  return (
    <div>
      <h1>Direktori</h1>

      {/* Input untuk menambahkan folder baru */}
      <div>
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="Nama Folder Baru"
        />
        <button onClick={addFolder}>Tambah Folder</button>
      </div>

      {/* Input untuk menambahkan file baru */}
      {editingFolderIndex !== null && (
        <div>
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="Nama File Baru"
          />
          <button onClick={() => addFileToFolder(editingFolderIndex)}>
            Tambah File
          </button>
        </div>
      )}

      {/* Menampilkan direktori */}
      <div>
        {direktori.map((folder, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            {/* Nama Folder, dengan fitur edit dan hapus */}
            <div>
              {editingFolderIndex === index ? (
                <div>
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                  />
                  <button onClick={() => editFolder(index)}>Simpan</button>
                </div>
              ) : (
                <div>
                  <strong>{folder.nama}</strong> (Folder)
                  <button onClick={() => setEditingFolderIndex(index)}>
                    Edit
                  </button>
                  <button onClick={() => deleteFolder(index)}>Hapus</button>
                  <button onClick={() => handleClick(index)}>Expand</button>
                </div>
              )}
            </div>

            {/* Menampilkan konten folder (file) */}
            {folder.konten && (
              <div style={{ marginLeft: '20px' }}>
                {folder.konten.map((file, fileIndex) => (
                  <div key={fileIndex}>
                    {file.nama} (File)
                    <button onClick={() => deleteFile(index, fileIndex)}>
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Direktori;
