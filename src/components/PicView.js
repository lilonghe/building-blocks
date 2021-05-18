import React from 'react';

export default class PicView extends React.Component {
    render() {
        const {
            src='',
            title,
            style={},
            ...rest
        } = this.props;

        let finalStyle = {
            textAlign: 'center',
            ...style
        }

        return <div {...rest} style={finalStyle}>
            <img src={src} />
            <div style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            }}>{title}</div>
        </div>
    }
}
