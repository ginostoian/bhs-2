import FormData from "form-data";

/**
 * Bunny.net Storage Service
 * Handles file uploads, deletions, and management for bunny.net storage
 */
class BunnyStorage {
  constructor() {
    this.apiKey = process.env.BUNNY_STORAGE_API_KEY;
    this.storageZoneName = process.env.BUNNY_STORAGE_ZONE_NAME;
    this.storageZoneRegion = process.env.BUNNY_STORAGE_ZONE_REGION || "de"; // Default to Frankfurt

    // Determine the correct regional endpoint
    const regionEndpoints = {
      de: "storage.bunnycdn.com", // Frankfurt (default)
      uk: "uk.storage.bunnycdn.com", // UK
      us: "ny.storage.bunnycdn.com", // New York
      sg: "sg.storage.bunnycdn.com", // Singapore
    };

    this.baseUrl = this.storageZoneName
      ? `https://${regionEndpoints[this.storageZoneRegion]}/${this.storageZoneName}`
      : null;
  }

  /**
   * Check if the service is properly configured
   * @returns {boolean} True if configured, false otherwise
   */
  isConfigured() {
    return !!(this.apiKey && this.storageZoneName && this.baseUrl);
  }

  /**
   * Validate configuration before operations
   * @private
   */
  _validateConfig() {
    if (!this.isConfigured()) {
      throw new Error(
        "BUNNY_STORAGE_API_KEY and BUNNY_STORAGE_ZONE_NAME must be set in environment variables",
      );
    }
  }

  /**
   * Validate file before upload
   * @param {Buffer} fileData - File data as buffer
   * @param {string} fileName - Name of the file
   * @param {number} maxSize - Maximum file size in bytes
   * @param {Array} allowedTypes - Array of allowed file extensions
   * @returns {Object} Validation result with isValid boolean and errors array
   */
  validateFile(
    fileData,
    fileName,
    maxSize = 50 * 1024 * 1024,
    allowedTypes = [],
  ) {
    const errors = [];

    // Check file size
    if (fileData.length > maxSize) {
      errors.push(
        `File size (${this.formatFileSize(fileData.length)}) exceeds maximum allowed size (${this.formatFileSize(maxSize)})`,
      );
    }

    // Check file type if allowedTypes is specified
    if (allowedTypes.length > 0) {
      const fileExtension = fileName
        .toLowerCase()
        .substring(fileName.lastIndexOf("."));
      if (!allowedTypes.includes(fileExtension)) {
        errors.push(
          `File type ${fileExtension} is not allowed. Allowed types: ${allowedTypes.join(", ")}`,
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Upload a file to bunny.net storage
   * @param {Buffer|string} fileData - File data as buffer or file path
   * @param {string} fileName - Name of the file
   * @param {string} folder - Folder path (optional)
   * @param {string} contentType - MIME type of the file
   * @param {string} userId - User ID for file isolation (optional)
   * @param {string} userName - User name for folder identification (optional)
   * @returns {Promise<Object>} Upload result with URL and metadata
   */
  async uploadFile(
    fileData,
    fileName,
    folder = "",
    contentType = null,
    userId = null,
    userName = null,
  ) {
    this._validateConfig();

    try {
      // Generate unique filename to prevent conflicts
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = fileName.substring(fileName.lastIndexOf("."));
      const baseName = fileName.substring(0, fileName.lastIndexOf("."));
      const uniqueFileName = `${baseName}_${timestamp}_${randomString}${fileExtension}`;

      // Create user-specific file path
      let filePath;
      if (userId) {
        // Create user-specific folder structure: users/{userId}-{userName}/{folder}/{filename}
        const userIdentifier = userName
          ? `${userId}-${userName.replace(/[^a-zA-Z0-9]/g, "")}`
          : userId;
        const userFolder = `users/${userIdentifier}`;
        filePath = folder
          ? `${userFolder}/${folder}/${uniqueFileName}`
          : `${userFolder}/${uniqueFileName}`;
      } else {
        // Fallback to original behavior for system files
        filePath = folder ? `${folder}/${uniqueFileName}` : uniqueFileName;
      }

      // Prepare headers
      const headers = {
        AccessKey: this.apiKey,
        "Content-Type": contentType || "application/octet-stream",
      };

      // Upload file
      const response = await fetch(`${this.baseUrl}/${filePath}`, {
        method: "PUT",
        headers,
        body: fileData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Upload failed: ${response.status} ${response.statusText} - ${errorText}`,
        );
      }

      const result = await response.json();

      return {
        originalName: fileName,
        fileName: uniqueFileName,
        filePath: filePath,
        url: `https://${this.storageZoneName}.b-cdn.net/${filePath}`,
        size: fileData.length,
        contentType: contentType || "application/octet-stream",
        uploadedAt: new Date().toISOString(),
        bunnyResponse: result,
        userId: userId, // Store userId for reference
        userName: userName, // Store userName for reference
      };
    } catch (error) {
      console.error("Bunny.net upload error:", error);
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  /**
   * Delete a file from bunny.net storage
   * @param {string} filePath - Path to the file in storage
   * @returns {Promise<Object>} Delete result
   */
  async deleteFile(filePath) {
    this._validateConfig();

    try {
      const response = await fetch(`${this.baseUrl}/${filePath}`, {
        method: "DELETE",
        headers: {
          AccessKey: this.apiKey,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Delete failed: ${response.status} ${response.statusText} - ${errorText}`,
        );
      }

      return {
        success: true,
        filePath: filePath,
        deletedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Bunny.net delete error:", error);
      throw new Error(`File deletion failed: ${error.message}`);
    }
  }

  /**
   * List files in a folder
   * @param {string} folder - Folder path (optional)
   * @param {string} userId - User ID to filter files (optional)
   * @param {string} userName - User name for folder identification (optional)
   * @returns {Promise<Array>} List of files
   */
  async listFiles(folder = "", userId = null, userName = null) {
    this._validateConfig();

    try {
      let listUrl;

      if (userId) {
        // List files for specific user
        const userIdentifier = userName
          ? `${userId}-${userName.replace(/[^a-zA-Z0-9]/g, "")}`
          : userId;
        const userFolder = `users/${userIdentifier}`;
        listUrl = `${this.baseUrl}/${userFolder}${folder ? `/${folder}` : ""}`;
      } else {
        // List all files (admin only)
        listUrl = `${this.baseUrl}/${folder}`;
      }

      const response = await fetch(listUrl, {
        method: "GET",
        headers: {
          AccessKey: this.apiKey,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `List failed: ${response.status} ${response.statusText} - ${errorText}`,
        );
      }

      const files = await response.json();
      return Array.isArray(files) ? files : [];
    } catch (error) {
      console.error("Bunny.net list error:", error);
      throw new Error(`File listing failed: ${error.message}`);
    }
  }

  /**
   * Get file info
   * @param {string} filePath - Path to the file in storage
   * @returns {Promise<Object>} File information
   */
  async getFileInfo(filePath) {
    this._validateConfig();

    try {
      const response = await fetch(`${this.baseUrl}/${filePath}`, {
        method: "HEAD",
        headers: {
          AccessKey: this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(
          `File info failed: ${response.status} ${response.statusText}`,
        );
      }

      return {
        filePath: filePath,
        size: parseInt(response.headers.get("content-length") || "0"),
        contentType: response.headers.get("content-type"),
        lastModified: response.headers.get("last-modified"),
        etag: response.headers.get("etag"),
      };
    } catch (error) {
      console.error("Bunny.net file info error:", error);
      throw new Error(`File info failed: ${error.message}`);
    }
  }

  /**
   * Format file size for display
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}

// Export singleton instance
const bunnyStorage = new BunnyStorage();
export default bunnyStorage;
