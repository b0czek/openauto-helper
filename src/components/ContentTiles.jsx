import React from "react";
import styled from "styled-components";

import Appearance, {
    parseHexColor,
    getCurrentColors,
    createRGBAString,
} from "../appearance";
import "./ContentTiles.scss";
import "../index.scss";

// generates black rgba color with given opacity
const getBackground = (backgroundColor, opacity) => {
    console.log(backgroundColor);
    return createRGBAString([...parseHexColor(backgroundColor), opacity]);
};

const Tile = styled.div`
    background-color: ${({ opacity, backgroundColor }) =>
        getBackground(backgroundColor, opacity)};
`;
//#region RegularTile
const ContentTile = React.forwardRef((props, ref) => {
    let appearance = Appearance.useContainer();
    return (
        <Tile
            className={mergeClasses(
                `contentTile contentTileLong unselectable`,
                props
            )}
            backgroundColor={getCurrentColors(appearance).ControlBackground}
            opacity={appearance.opacity}
            ref={ref}>
            {props.children}
        </Tile>
    );
});

const ContentTileContent = (props) => (
    <div className={mergeClasses("contentTileContent centerChildren", props)}>
        {props.children}
    </div>
);
const ContentTileText = (props) => (
    <div className="contentTileTextContainer">
        <span className={mergeClasses("contentTileText", props)}>
            {props.children}
        </span>
    </div>
);
//#endregion RegularTile

//#region ShortTile
const ContentTileShort = React.forwardRef((props, ref) => {
    let appearance = Appearance.useContainer();
    return (
        <Tile
            className={mergeClasses(
                "contentTile contentTileShort unselectable",
                props
            )}
            backgroundColor={getCurrentColors(appearance).ControlBackground}
            opacity={appearance.opacity}
            ref={ref}>
            {props.children}
        </Tile>
    );
});
const ShortTileText = (props) => (
    <div className={mergeClasses("contentTileShortText", props)}>
        {props.children}
    </div>
);

const ShortTileContent = (props) => (
    <div
        className={mergeClasses(
            "contentTileShortContent centerChildren",
            props
        )}>
        {props.children}
    </div>
);
//#endregion ShortTile

export const ShortTile = {
    ...ContentTileShort,
    Text: ShortTileText,
    Content: ShortTileContent,
};
const ContentTiles = {
    ...ContentTile,
    Content: ContentTileContent,
    Text: ContentTileText,
    Short: ShortTile,
};
export default ContentTiles;

const mergeClasses = (classNames, props) =>
    `${classNames} ${props.className ? props.className : ""}`;
