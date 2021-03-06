let app = new Vue({
    el:"#mainGoods",
    data:{
        lunImage:["img/lun/lun1.png","img/lun/lun2.png","img/lun/lun3.png","img/lun/lun4.png"],
        allGoodsList:[],
        sear:"",
        activeIndex:'1',
    },
    methods: {
        // 获取所有的商品信息进行渲染
        getTheAllGoodsInfo(){
            let that = this
            axios.get("http://localhost:8081/goods")
                    .then(res=>{
                        that.allGoodsList = res.data.data
                    })
                    .catch(res=>{console.log(res.data)})

        },
        goToTheGoodsInfo(i){
            localStorage.nowGoodId = i
            window.location.href="goodsinfo.html"
        },
        goToTheSearchPage(){
            window.location.href="searchPage.html"
        }
    },
    mounted(){
        this.getTheAllGoodsInfo()//一开始便执行
    },
})