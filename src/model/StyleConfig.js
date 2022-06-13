const StyleConfig = { 
    systemBar: {
        height: '40px',
        iconButton: { 
            size:"24",
            color:"grey darken-3",
            class:"mx-1",
        },
        verticalDivider: { inset:true, vertical:true, class:"mx-1", style:"border-color:grey; border-width:1px"},
        label: {class:"mx-1 pa-0 d-inline", style:{height:'24px', 'font-size':'16px', 'font-weight':'500'}},
        icon: { 
            size:"20",
            color:"grey darken-3",
            class:"mx-1",
        },
        combo: { class:"mx-1", small:true, 'single-line':true, height:"24", style:"max-width:200px;"},
        alertIcon: { 
            size:"24",
            color:"grey darken-3",
            class:"mx-1",
        },
    },
    sideBar: {
        iconButton: {             
            size:"28",
            color:"grey darken-3",
            class:"mx-1",
        },
    },
    mapToolBar: {
        bar: {
            style: 'height:100%; background-color:#fff; opacity:1.0',
        },

        iconButton: { 
            size:"32",
            color:"grey darken-3",
            class:"mx-1",
        },
    },
    contextMenu: {
        menu: {
            style:{'font-size':'14px', 'font-weight': 400},
        }
    },
    statusBar: {
        height: '32px',
    }
}

export default StyleConfig;