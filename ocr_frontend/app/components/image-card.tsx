import { Delete } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";

interface Props {
  name: string;
  description: string;
  imageUrl: string;
  onClick: () => void;
}

export default function ImageCard({ name, description, imageUrl, onClick }: Props) {
  return (
    <button className="image-card" onClick={onClick}>
      <img src={imageUrl} alt={name} className="image-card_img" />
      <div className="image-card_body">
        {/* <span className="image-card_name">{name}</span>
        <span className="image-card_desc">{description}</span> */}
        <Typography variant="body1">{name}</Typography>
        <Typography variant="subtitle1">{description}</Typography>
      </div>

      <style>{`
        .image-card {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 10px 12px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s, border-color 0.15s;
        }

        .image-card:hover {
          background: #f8fafc;
          border-color: #94a3b8;
        }

        .image-card_img {
          width: 52px;
          height: 52px;
          object-fit: cover;
          border-radius: 6px;
          flex-shrink: 0;
        }

        .image-card_body {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
      `}</style>
    </button>
  );
}