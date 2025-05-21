import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Music, X, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';

const UploadPage = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  
  const dropzoneRef = useRef(null);
  const formRef = useRef(null);
  const progressRef = useRef(null);
  
  useEffect(() => {
    if (dropzoneRef.current) {
      gsap.from(dropzoneRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    }
  }, []);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    
    if (droppedFile && droppedFile.type.startsWith('audio/')) {
      setFile(droppedFile);
      // Try to extract title and artist from filename
      const filename = droppedFile.name.replace(/\.[^/.]+$/, "");
      if (filename.includes(' - ')) {
        const [artist, title] = filename.split(' - ');
        setArtist(artist);
        setTitle(title);
      } else {
        setTitle(filename);
      }
    }
  };
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile && selectedFile.type.startsWith('audio/')) {
      setFile(selectedFile);
      // Try to extract title and artist from filename
      const filename = selectedFile.name.replace(/\.[^/.]+$/, "");
      if (filename.includes(' - ')) {
        const [artist, title] = filename.split(' - ');
        setArtist(artist);
        setTitle(title);
      } else {
        setTitle(filename);
      }
    }
  };
  
  const handleRemoveFile = () => {
    setFile(null);
    setTitle('');
    setArtist('');
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!file || !title || !artist) return;
    
    setIsUploading(true);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadComplete(true);
            
            // Reset after a delay
            setTimeout(() => {
              setFile(null);
              setTitle('');
              setArtist('');
              setUploadProgress(0);
              setUploadComplete(false);
            }, 3000);
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };
  
  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-content mb-2">Upload Music</h1>
        <p className="text-text-light">Add songs to your ReverBeat library</p>
      </div>
      
      {uploadComplete ? (
        <div className="bg-navy-dark rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-content mb-2">Upload Successful!</h2>
          <p className="text-text-light">Your track "{title}" has been uploaded and is now available in your library.</p>
        </div>
      ) : (
        <div className="bg-navy-dark rounded-lg p-6">
          {!file ? (
            <div 
              ref={dropzoneRef}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging ? 'border-accent bg-navy-light' : 'border-navy-light'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <UploadCloud size={48} className="mx-auto mb-4 text-text-light" />
              <h2 className="text-xl font-bold text-content mb-2">Drag & Drop Audio Files</h2>
              <p className="text-text-light mb-6">or click to browse from your device</p>
              
              <input
                type="file"
                id="fileUpload"
                className="hidden"
                accept="audio/*"
                onChange={handleFileChange}
              />
              <label
                htmlFor="fileUpload"
                className="btn btn-primary inline-block cursor-pointer"
              >
                Browse Files
              </label>
              
              <p className="mt-4 text-text-dark text-sm">
                Supported formats: MP3, WAV, FLAC, OGG (max 20MB)
              </p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center p-4 bg-navy rounded-lg">
                <div className="w-12 h-12 flex-shrink-0 bg-navy-light rounded-full flex items-center justify-center mr-4">
                  <Music size={24} className="text-text-light" />
                </div>
                <div className="flex-grow">
                  <div className="text-content font-medium truncate">{file.name}</div>
                  <div className="text-text-dark text-sm">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-text-dark hover:text-text-light p-2"
                  aria-label="Remove file"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-text-light mb-2">
                  Track Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field"
                  placeholder="Enter track title"
                  required
                  aria-label="Track title"
                />
              </div>
              
              <div>
                <label htmlFor="artist" className="block text-sm font-medium text-text-light mb-2">
                  Artist Name
                </label>
                <input
                  type="text"
                  id="artist"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="input-field"
                  placeholder="Enter artist name"
                  required
                  aria-label="Artist name"
                />
              </div>
              
              {isUploading && (
                <div ref={progressRef} className="mt-4">
                  <div className="flex justify-between text-sm text-text-light mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-navy rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="btn btn-secondary mr-4"
                  disabled={isUploading}
                  aria-label="Cancel upload"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isUploading || !title || !artist}
                  aria-label="Upload track"
                >
                  {isUploading ? 'Uploading...' : 'Upload Track'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadPage;