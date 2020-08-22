import React from 'react';

export default class PicView extends React.Component {
    render() {
        const {
            src='https://fs.zto.com/fs1/M00/06/DE/wKhBFlnve0eAX4MgAACafKWUh8o985.png?width=48',
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
