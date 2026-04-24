interface Props {
  name: string;
  description: string;
  imageUrl: string;
  onClick: () => void;
}

export default function ImageCard({ name, description, imageUrl, onClick }: Props) {
  return (
    <button className="image-card" onClick={onClick}>
      <img src={imageUrl} alt={name} className="image-card__img" />
      <div className="image-card__body">
        <span className="image-card__name">{name}</span>
        <span className="image-card__desc">{description}</span>
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

        .image-card__img {
          width: 52px;
          height: 52px;
          object-fit: cover;
          border-radius: 6px;
          flex-shrink: 0;
        }

        .image-card__body {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .image-card__name {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .image-card__desc {
          font-size: 0.78rem;
          color: #94a3b8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </button>
  );
}