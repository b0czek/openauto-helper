import "./ContentTiles.scss";
export const ContentTile = (props) => (
    <div
        className={`contentTile contentTileLong ${
            props.className ? props.className : ""
        }`}>
        {props.children}
    </div>
);

export const ContentTileShort = (props) => (
    <div className="contentTile contentTileShort">{props.children}</div>
);
