"use client";

type Props = {
  label: string;
  type: string;
  register: any;
  error?: string;
};

export default function Input({ label, type, register, error }: Props) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <label style={{ fontWeight: 600, display: "block", marginBottom: "6px" }}>
        {label}
      </label>
      <input
        type={type}
        {...register}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "6px",
          border: error ? "1px solid red" : "1px solid #ccc",
        }}
      />
      {error ? (
        <p style={{ color: "red", marginTop: "6px", fontSize: "13px" }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
