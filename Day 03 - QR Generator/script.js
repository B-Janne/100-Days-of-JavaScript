// QR Code Generator JavaScript
class QRCodeGenerator {
  constructor() {
    this.initElements();
    this.bindEvents();
    this.qr = null;
  }

  initElements() {
    // Input elements
    this.textInput = document.getElementById("textInput");
    this.sizeSelect = document.getElementById("sizeSelect");
    this.errorCorrectionSelect = document.getElementById(
      "errorCorrectionSelect"
    );

    // Button elements
    this.generateBtn = document.getElementById("generateBtn");
    this.clearBtn = document.getElementById("clearBtn");
    this.downloadBtn = document.getElementById("downloadBtn");
    this.copyBtn = document.getElementById("copyBtn");

    // Display elements
    this.qrResult = document.getElementById("qrResult");
    this.resultSection = document.getElementById("resultSection");
    this.downloadSection = document.getElementById("downloadSection");
    this.errorMessage = document.getElementById("errorMessage");
    this.successMessage = document.getElementById("successMessage");
  }

  bindEvents() {
    // Button event listeners
    this.generateBtn.addEventListener("click", () => this.generateQRCode());
    this.clearBtn.addEventListener("click", () => this.clearAll());
    this.downloadBtn.addEventListener("click", () => this.downloadQRCode());
    this.copyBtn.addEventListener("click", () => this.copyToClipboard());

    // Input event listeners
    this.textInput.addEventListener("input", () => this.hideMessages());
    this.textInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.generateQRCode();
      }
    });

    // Auto-generate on option changes if text exists
    this.sizeSelect.addEventListener("change", () => this.autoRegenerate());
    this.errorCorrectionSelect.addEventListener("change", () =>
      this.autoRegenerate()
    );
  }

  autoRegenerate() {
    if (this.textInput.value.trim() && this.qr) {
      this.generateQRCode();
    }
  }

  generateQRCode() {
    const text = this.textInput.value.trim();

    if (!text) {
      this.showError("Please enter some text or URL to generate QR code");
      this.textInput.focus();
      return;
    }

    if (text.length > 1000) {
      this.showError("Text is too long. Please keep it under 1000 characters.");
      return;
    }

    try {
      this.showLoading();

      // Small delay to show loading state
      setTimeout(() => {
        this.createQRCode(text);
      }, 300);
    } catch (error) {
      this.showError("Failed to generate QR code. Please try again.");
      console.error("QR Code generation error:", error);
    }
  }

  createQRCode(text) {
    try {
      const size = parseInt(this.sizeSelect.value);
      const errorCorrection = this.errorCorrectionSelect.value;

      // Create canvas element
      const canvas = document.createElement("canvas");

      // Create QR code using QRious library
      this.qr = new QRious({
        element: canvas,
        value: text,
        size: size,
        level: errorCorrection,
        background: "#ffffff",
        foreground: "#000000",
      });

      this.displayQRCode(canvas);
      this.showSuccess("QR code generated successfully!");
    } catch (error) {
      this.showError("Error creating QR code. Please check your input.");
      console.error("QR creation error:", error);
    }
  }

  displayQRCode(canvas) {
    // Clear previous content
    this.qrResult.innerHTML = "";

    // Add fade-in animation
    canvas.classList.add("fade-in");

    // Append the canvas to result area
    this.qrResult.appendChild(canvas);

    // Update UI states
    this.resultSection.classList.add("has-qr");
    this.downloadSection.classList.add("show");
    this.downloadBtn.disabled = false;
    this.copyBtn.disabled = false;
  }

  showLoading() {
    this.generateBtn.innerHTML = '<span class="loading"></span> Generating...';
    this.generateBtn.disabled = true;
    this.hideMessages();
  }

  clearAll() {
    // Clear input
    this.textInput.value = "";

    // Reset QR display
    this.qrResult.innerHTML = `
          <div class="placeholder">
              <div class="placeholder-icon">📱</div>
              <div>Your QR code will appear here</div>
          </div>
      `;

    // Reset UI states
    this.resultSection.classList.remove("has-qr");
    this.downloadSection.classList.remove("show");
    this.downloadBtn.disabled = true;
    this.copyBtn.disabled = true;
    this.generateBtn.innerHTML = "Generate QR Code";
    this.generateBtn.disabled = false;
    this.qr = null;

    // Hide messages
    this.hideMessages();

    // Focus input
    this.textInput.focus();
  }

  async downloadQRCode() {
    if (!this.qr) {
      this.showError("No QR code to download");
      return;
    }

    try {
      const canvas = this.qrResult.querySelector("canvas");

      // Create download link
      const link = document.createElement("a");
      link.download = `qrcode-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.showSuccess("QR code downloaded successfully!");
    } catch (error) {
      this.showError("Failed to download QR code");
      console.error("Download error:", error);
    }
  }

  async copyToClipboard() {
    if (!this.qr) {
      this.showError("No QR code to copy");
      return;
    }

    try {
      const canvas = this.qrResult.querySelector("canvas");

      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        try {
          const item = new ClipboardItem({ "image/png": blob });
          await navigator.clipboard.write([item]);
          this.showSuccess("QR code copied to clipboard!");
        } catch (clipError) {
          // Fallback for browsers that don't support ClipboardItem
          this.fallbackCopy(canvas);
        }
      });
    } catch (error) {
      this.showError("Failed to copy QR code to clipboard");
      console.error("Copy error:", error);
    }
  }

  fallbackCopy(canvas) {
    try {
      // Create a temporary link with data URL
      const dataUrl = canvas.toDataURL("image/png");

      // Create temporary input to copy data URL
      const tempInput = document.createElement("input");
      tempInput.value = dataUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);

      this.showSuccess("QR code data copied to clipboard!");
    } catch (error) {
      this.showError("Copy to clipboard not supported in this browser");
    }
  }

  showError(message) {
    this.hideMessages();
    this.errorMessage.textContent = message;
    this.errorMessage.classList.add("show");
    this.generateBtn.innerHTML = "Generate QR Code";
    this.generateBtn.disabled = false;

    // Auto-hide after 5 seconds
    setTimeout(() => this.hideMessages(), 5000);
  }

  showSuccess(message) {
    this.hideMessages();
    this.successMessage.textContent = message;
    this.successMessage.classList.add("show");
    this.generateBtn.innerHTML = "Generate QR Code";
    this.generateBtn.disabled = false;

    // Auto-hide after 3 seconds
    setTimeout(() => this.hideMessages(), 3000);
  }

  hideMessages() {
    this.errorMessage.classList.remove("show");
    this.successMessage.classList.remove("show");
  }

  // Utility method to validate URLs
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Get QR code info for display
  getQRInfo() {
    if (!this.qr) return null;

    return {
      text: this.textInput.value,
      size: this.sizeSelect.value,
      errorCorrection: this.errorCorrectionSelect.value,
      isUrl: this.isValidUrl(this.textInput.value),
    };
  }
}

// Initialize the QR Code Generator when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const qrGenerator = new QRCodeGenerator();

  // Make it globally accessible for debugging
  window.qrGenerator = qrGenerator;
});

// Service Worker for offline functionality (optional enhancement)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Could implement caching for offline use
    console.log("QR Generator ready for offline enhancement");
  });
}
