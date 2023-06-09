import Toast from "react-bootstrap/Toast";

export const Toaster = ({ text, showToaster, setShowToaster }) => {
  return (
    <Toast
      onClose={() => setShowToaster(false)}
      show={showToaster}
      delay={2000}
      autohide
    >
      <Toast.Header>
        <strong className="me-auto">Portfolio</strong>
        <small>Just now</small>
      </Toast.Header>
      <Toast.Body>{text}</Toast.Body>
    </Toast>
  );
};
