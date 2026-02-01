import { useState } from "react";

function ShareModal({ shareUrl, title, onClose }) {
    const [showQR, setShowQR] = useState(false);

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h3>Share this item</h3>

                <button
                    style={styles.button}
                    onClick={() => {
                        navigator.clipboard.writeText(shareUrl);
                        alert("Link copied to clipboard!");
                    }}
                >
                    🔗 Copy Link
                </button>

                <button
                    style={styles.button}
                    onClick={() => setShowQR((prev) => !prev)}
                >
                    📱 {showQR ? "Hide QR Code" : "Generate QR Code"}
                </button>

                {showQR && (
                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                            shareUrl
                        )}`}
                        alt="QR Code"
                        style={{ marginTop: "16px" }}
                    />
                )}

                <button style={styles.close} onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    },
    modal: {
        backgroundColor: "#fff",
        padding: "24px",
        borderRadius: "12px",
        width: "90%",
        maxWidth: "320px",
        textAlign: "center",
    },
    button: {
        width: "100%",
        padding: "12px",
        marginTop: "12px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        backgroundColor: "#2563eb",
        color: "#fff",
        fontSize: "15px",
    },
    close: {
        marginTop: "16px",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#374151",
    },
};

export default ShareModal;
