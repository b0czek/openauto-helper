import "./ContentTiles.scss";
export const ContentTile = (props) => (
    <div className="contentTile">{props.children}</div>
);

export const ContentTileShort = (props) => (
    <div className="contentTileShort">{props.children}</div>
);
