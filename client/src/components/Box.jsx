import { Link } from "react-router-dom";

export default function Box(props) {
  let icons = [
    <i className="far fa-dollar" />,
    <i className="fa-solid fa-arrow-trend-down"></i>,
    <i className="fa-solid fa-file-invoice-dollar"></i>,
    <i className="far fa-envelope" />,
    <i className="fa-solid fa-rotate-left nav-icon" />,
    <i class="fa-solid fa-warehouse"></i>,
    <i class="fa-solid fa-up-long"></i>,
    <i class="fa-solid fa-heart-circle-bolt"></i>
  ];
  return (
    <Link style={{ color: "Black" }} to={`/${props.anchor}`}>
      <div
        className={`info-box ${
          props.inContact === false ? null : "bg-primary"
        } ${props.inContact === "success" ? "bg-success" : null}`}
        style={{
          background: "rgba(000, 000, 000, 0.2)",
          borderRadius: 10,
          padding: 20,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          cursor: "pointer",
        }}
      >
        <span
          className="info-box-icon rounded-circle"
          style={{
            padding: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255, 255, 255, 0.5)",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          {icons[props.icon]}
        </span>
        <div className="info-box-content">
          <span className="info-box-text">{props.name}</span>
          <span className="info-box-number">{props.value}</span>
        </div>
      </div>
    </Link>
  );
}
