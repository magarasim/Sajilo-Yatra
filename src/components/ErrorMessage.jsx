function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="error-text">
      {message}
    </div>
  );
}

export default ErrorMessage;

