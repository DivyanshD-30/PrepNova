import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FiUploadCloud, FiFile, FiX } from 'react-icons/fi'
import './ResumeDropzone.scss'

/**
 * ResumeDropzone — drag-and-drop (or click) file upload for resumes.
 * @param {File|null} file
 * @param {Function} onFileSelect
 */
export default function ResumeDropzone({ file, onFileSelect }) {
  const inputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) onFileSelect(dropped)
  }

  const handleChange = (e) => {
    const selected = e.target.files?.[0]
    if (selected) onFileSelect(selected)
  }

  if (file) {
    return (
      <motion.div className="resume-dropzone resume-dropzone--filled" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <span className="resume-dropzone__file-icon"><FiFile /></span>
        <div className="resume-dropzone__file-info">
          <p className="resume-dropzone__file-name">{file.name}</p>
          <p className="resume-dropzone__file-size">{(file.size / 1024).toFixed(0)} KB</p>
        </div>
        <button
          type="button"
          className="resume-dropzone__remove"
          onClick={(e) => {
            e.preventDefault()
            onFileSelect(null)
            if (inputRef.current) inputRef.current.value = ''
          }}
          aria-label="Remove file"
        >
          <FiX />
        </button>
      </motion.div>
    )
  }

  return (
    <label
      htmlFor="resume"
      className={`resume-dropzone ${dragActive ? 'resume-dropzone--active' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      <span className="resume-dropzone__icon"><FiUploadCloud /></span>
      <p className="resume-dropzone__title">Click to upload or drag &amp; drop</p>
      <p className="resume-dropzone__subtitle">PDF or DOCX (Max 5MB)</p>
      <input ref={inputRef} hidden type="file" id="resume" name="resume" accept=".pdf,.docx" onChange={handleChange} />
    </label>
  )
}
