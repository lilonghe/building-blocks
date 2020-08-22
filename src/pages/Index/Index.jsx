import React from 'react';
import styles from './Index.styl';
import EditComponentModal from './EditComponentModal';
import {Affix, Select} from "antd";
import Toolbox from './Toolbox';
import PicView from "../../components/PicView";
import Tree, { TreeNode } from 'rc-tree';
import 'rc-tree/assets/index.css';
import templates from "../../components/templates";
import Preview from './Preview';


export default class Index extends React.Component {
    state = {
        targetEditComponent: {},
        showEditModal: false,
        workViewScale: 1,
        device: 375,

        eleList: [],
    };

    componentDidMount() {
        this.loadLocalData();
    }

    closeEditComponentModal = () => {
        this.setState({
            showEditModal: false
        })
    }

    changeWorkViewScale = (val) => {
        this.setState({
            workViewScale: val,
        })
    }

    changeDevice = (val) => {
        this.setState({
            device: val,
        })
    }

    onDrop = (e) => {
        e.preventDefault();

        let pid = e.target.getAttribute('id');
        let tag = e.dataTransfer.getData("tag");
        let tagTemplate = templates.find(item=>item.tag==tag);
        let id = Math.random()+new Date().getTime();
        let target = {
            id,
            tag: tagTemplate.tag,
            property: {},
            parent_id: pid,
        };
        this.setState({
            eleList: [...this.state.eleList, target],
        }, this.autoSaveLocalData)
    }

    onDrag = (e) => {
        let tag = e.target.getAttribute('tag');
        e.dataTransfer.setData("tag",tag);
    }

    selectTargetElement = (e, target) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            showEditModal: true,
            targetEditComponent: target,
        })
    }

    onChangeProperty = (id, key, val) => {
        let i = this.state.eleList.findIndex(item=>item.id == id);
        let item = this.state.eleList.find(item=>item.id == id);
        if (!item.property) {
            item.property = {};
        }
        item.property[key] = val;
        item.key = Math.random();
        this.setState({
            eleList: [
                ...this.state.eleList.slice(0, i),
                {
                    ...item,
                },
                ...this.state.eleList.slice(i+1),
            ]
        }, this.autoSaveLocalData);
    }

    autoSaveLocalData = () => {
        let eleList = this.state.eleList;
        localStorage.setItem('ele-list', JSON.stringify(eleList));
    }

    loadLocalData = () => {
        let str = localStorage.getItem('ele-list');
        if (str) {
            this.setState({
                eleList: JSON.parse(str),
            })
        }
    }

    delEle = (id) => {
        let i = this.state.eleList.findIndex(item=>item.id == id);
        this.setState({
            eleList: [
                ...this.state.eleList.slice(0, i),
                ...this.state.eleList.slice(i+1),
            ],
            showEditModal: false,
        }, this.autoSaveLocalData);
    }

    menusToTree(menus) {
        let data = JSON.parse(JSON.stringify(menus));
        data.forEach(item => {
            delete item.children;
        });

        const map = {};
        data.forEach(item => {
            map[item.id] = item;
        });

        const val = [];
        data.forEach(item => {
            // item.key = item.id;
            // item.value = item.id;
            const parent = map[item.parent_id];

            if (parent) {
                // item.disabled = parent.disabled;
                if (parent.parents) {
                    item.parents = parent.parents.concat(parent.id);
                } else {
                    item.parents = [parent.id];
                }
                (parent.children || (parent.children = [])).push(item);
            } else {
                val.push(item);
            }
        });
        return val;
    }

    render() {
        const { showEditModal, targetEditComponent, workViewScale, eleList, device } = this.state;

        let elements = this.menusToTree(eleList);
        const loop = (data) => data.map((item) => {
            let children;
            if (item.children) {
                children = loop(item.children);
            }
            let ele;
            let tempEle = templates.find(e=>e.tag === item.tag);

            let normalProperty = {};
            let styleProperty = {};
            tempEle.property.map(t => {
                if (item.property && item.property[t.key]) {
                    if (t.type === 'style') {
                        styleProperty[t.key] = item.property[t.key];
                    } else {
                        normalProperty[t.key] = item.property[t.key];
                    }
                }
            })

            if (tempEle.userCustom) {
                if (item.tag === 'PicView') {
                    ele = <PicView
                        key={item.id}
                        {...item}
                        {...normalProperty}
                        style={styleProperty}
                        onClick={(e)=>this.selectTargetElement(e, item)}
                        onDragOver={e=>e.preventDefault()}
                    />
                }
            } else {
                if (normalProperty['text']) {
                    children = <>{normalProperty['text']}{children}</>
                }
                ele = React.createElement(item.tag, {
                    ...item,
                    ...normalProperty,
                    key: item.key || item.id,
                    id: item.id,
                    style: styleProperty,
                    onClick: (e)=>this.selectTargetElement(e, item),
                    onDragOver: e=>e.preventDefault(),
                    onDrop: e=>{
                        if(!item.finalTag){
                            this.onDrop(e)
                        }
                    },
                }, children || null);
            }
            return ele;
        });

        const loopText = (data) => data.map((item) => {
            let tempEle = templates.find(e=>e.tag === item.tag);
            if (item.children) {
                let children = loopText(item.children);
                return <TreeNode key={item.id} title={tempEle.title} data={item}>
                    {children}
                </TreeNode>;
            }

            return <TreeNode key={item.id} title={tempEle.title} data={item} />;
        });

        return (<div>
            <div style={{display: 'flex'}}>
                <div className={styles.toolbox}>
                    <Toolbox templates={templates} onDrag={this.onDrag} />
                </div>

                <div className={styles.workViewWrapper}>
                    <Affix offsetTop={0}>
                        <Select value={workViewScale} style={{width: 100}} onChange={this.changeWorkViewScale}>
                            <Select.Option value={1}>100%</Select.Option>
                            <Select.Option value={0.75}>75%</Select.Option>
                            <Select.Option value={0.5}>50%</Select.Option>
                        </Select>
                        <Select value={device} style={{width: 100, marginLeft: 10}} onChange={this.changeDevice}>
                            <Select.Option value={350}>iPhone SE</Select.Option>
                            <Select.Option value={375}>iPhone X</Select.Option>
                            <Select.Option value={768}>iPad</Select.Option>
                            <Select.Option value={1366}>Desktop</Select.Option>
                        </Select>
                    </Affix>
                    <div
                        onDragOver={e=>e.preventDefault()}
                        onDrop={this.onDrop}
                        style={{transform: `scale({workViewScale})`, width: device + 'px'}}
                        id={'work-views'}
                        className={styles.workView}>
                        {loop(elements)}
                    </div>
                </div>
                <div style={{flex: 1}}>
                    <Tree
                        onDrop={this.onDropTreeNode}
                        draggable={true}
                        onSelect={(_, { node: { data }, nativeEvent })=>this.selectTargetElement(nativeEvent, data)} >
                        {loopText(elements)}
                    </Tree>
                </div>
                <div style={{width: device, border: '1px solid red'}}>
                    <Preview data={mockData} elementList={eleList} />
                </div>
            </div>


            <EditComponentModal delEle={this.delEle} key={targetEditComponent.id}
                                onChangeProperty={this.onChangeProperty}
                                onChangeStyle={this.onChangeStyle} onClose={this.closeEditComponentModal} visible={showEditModal} target={targetEditComponent} />
        </div>)
    }

    onDropTreeNode = (info) => {
        console.log(info);
        const {node, dragNode} = info;
        let template = templates.find(item=>item.tag==node.data.tag);
        if (template.finalTag || info.dropToGap) return;

        let currentNodeId = dragNode.data.id;
        let parentNodeId = node.data.id;


        let i = this.state.eleList.findIndex(item=>item.id == currentNodeId);
        let item = this.state.eleList.find(item=>item.id == currentNodeId);
        item.parent_id = parentNodeId;
        item.key = Math.random();
        this.setState({
            eleList: [
                ...this.state.eleList.slice(0, i),
                {
                    ...item,
                },
                ...this.state.eleList.slice(i+1),
            ]
        }, this.autoSaveLocalData);
    }
}


const mockData = {
    banner: {
        title: "abc",
        sloganImg: "https://fs.zto.com/fs1/M00/06/DE/wKhBFlnve0eAX4MgAACafKWUh8o985.png?width=48"
    }
}