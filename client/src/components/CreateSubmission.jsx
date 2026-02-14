import { useState } from "react";
import { motion } from "framer-motion";
import { submissionService } from "../services/submissionService.js";

const CreateSubmission = ({ bugId, onSuccess, onCancel }) => {
  const [proofType, setProofType] = useState("image");
  const [proofInputMode, setProofInputMode] = useState("link"); 
  const [formData, setFormData] = useState({
    solutionDescription: "",
    proofUrl: "",
    proofFile: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

  const handleChange = (e) => {
    if (e.target.name === "proofFile") {
      const file = e.target.files[0];
      if (file) {
        setFormData({
          ...formData,
          proofFile: file,
        });
        setFilePreview(file.name);
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const resetProofInput = () => {
    setFormData((prev) => ({ ...prev, proofUrl: "", proofFile: null }));
    setFilePreview(null);
  };

  const handleFileUpload = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let proofUrl = formData.proofUrl;
      let proofFileName = null;

      const useUpload =
        proofType === "file" ||
        (proofType === "image" && proofInputMode === "upload") ||
        (proofType === "video" && proofInputMode === "upload");

      if (useUpload) {
        if (!formData.proofFile) {
          setError(
            proofType === "file"
              ? "Please select a file to upload"
              : proofType === "image"
                ? "Please select an image to upload"
                : "Please select a video to upload",
          );
          setLoading(false);
          return;
        }
        proofUrl = await handleFileUpload(formData.proofFile);
        proofFileName = formData.proofFile.name;
      } else if (!proofUrl || !proofUrl.trim()) {
        setError(
          proofType === "image"
            ? "Please provide an image URL or upload an image"
            : proofType === "video"
              ? "Please provide a video URL or upload a video"
              : "Please provide proof URL",
        );
        setLoading(false);
        return;
      }

      await submissionService.createSubmission(
        bugId,
        formData.solutionDescription,
        proofUrl,
        proofType,
        proofFileName,
      );
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit solution");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <h3 className="text-xl sm:text-2xl font-extrabold gradient-text mb-4 sm:mb-6 break-words">
        Submit Solution
      </h3>

      {error && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-4"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="solutionDescription"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Solution Description *
          </label>
          <textarea
            id="solutionDescription"
            name="solutionDescription"
            required
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
            placeholder="Describe your solution in detail"
            value={formData.solutionDescription}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Proof Type *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setProofType("image");
                setProofInputMode("link");
                resetProofInput();
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                proofType === "image"
                  ? "bg-olive-700 dark:bg-olive-800 text-white border-2 border-olive-800 shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Image
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setProofType("video");
                setProofInputMode("link");
                resetProofInput();
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                proofType === "video"
                  ? "bg-olive-700 dark:bg-olive-800 text-white border-2 border-olive-800 shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Video
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setProofType("file");
                resetProofInput();
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                proofType === "file"
                  ? "bg-olive-700 dark:bg-olive-800 text-white border-2 border-olive-800 shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              File
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setProofType("url");
                resetProofInput();
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                proofType === "url"
                  ? "bg-olive-700 dark:bg-olive-800 text-white border-2 border-olive-800 shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Other URL
            </motion.button>
          </div>
        </div>

        {(proofType === "image" || proofType === "video") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Add proof via
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setProofInputMode("link");
                  resetProofInput();
                }}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  proofInputMode === "link"
                    ? "bg-olive-700 dark:bg-olive-800 text-white border-2 border-olive-800 shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Paste Link
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setProofInputMode("upload");
                  resetProofInput();
                }}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  proofInputMode === "upload"
                    ? "bg-olive-700 dark:bg-olive-800 text-white border-2 border-olive-800 shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Upload File
              </motion.button>
            </div>
          </div>
        )}

        <div>
          {proofType === "file" ||
          (proofType === "image" && proofInputMode === "upload") ||
          (proofType === "video" && proofInputMode === "upload") ? (
            <>
              <label
                htmlFor="proofFile"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {proofType === "image" && "Upload Image *"}
                {proofType === "video" && "Upload Video *"}
                {proofType === "file" && "Upload Proof File *"}
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-olive-400 dark:hover:border-olive-500 transition-colors bg-gray-50 dark:bg-gray-700/50">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center flex-wrap gap-x-1">
                    <label
                      htmlFor="proofFile"
                      className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-olive-600 dark:text-olive-400 hover:text-olive-500 dark:hover:text-olive-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-olive-500"
                    >
                      <span>Choose file</span>
                      <input
                        id="proofFile"
                        name="proofFile"
                        type="file"
                        className="sr-only"
                        accept={
                          proofType === "image"
                            ? "image/*"
                            : proofType === "video"
                              ? "video/*"
                              : undefined
                        }
                        onChange={handleChange}
                      />
                    </label>
                    <p>or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {proofType === "image" && "PNG, JPG, GIF, WebP"}
                    {proofType === "video" && "MP4, WebM, MOV"}
                    {proofType === "file" && "PDF, DOC, TXT, or any file"}
                  </p>
                  {filePreview && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                      Selected: {filePreview}
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <label
                htmlFor="proofUrl"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {proofType === "image" && "Image URL *"}
                {proofType === "video" && "Video URL *"}
                {proofType === "url" && "Proof URL *"}
              </label>
              <input
                type="url"
                id="proofUrl"
                name="proofUrl"
                required={proofInputMode === "link" || proofType === "url"}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                placeholder={
                  proofType === "image"
                    ? "https://example.com/image.png or https://imgur.com/..."
                    : proofType === "video"
                      ? "https://youtube.com/watch?v=... or https://vimeo.com/..."
                      : "https://example.com/proof"
                }
                value={formData.proofUrl}
                onChange={handleChange}
              />
              {proofType === "image" && formData.proofUrl && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2"
                >
                  <img
                    src={formData.proofUrl}
                    alt="Proof preview"
                    className="w-full max-w-full h-auto max-h-48 sm:max-h-64 rounded-md border border-gray-300 dark:border-gray-600"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </motion.div>
              )}
              {proofType === "video" && formData.proofUrl && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>Video link: {formData.proofUrl}</p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 btn-olive text-white font-bold py-3 px-4 rounded-xl disabled:opacity-50 transition-all duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit Solution"
            )}
          </motion.button>
          <motion.button
            type="button"
            onClick={onCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-bold py-3 px-4 rounded-xl border-2 border-gray-400 dark:border-gray-500 shadow-md hover:shadow-lg transition-all duration-200"
          >
            Cancel
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateSubmission;
