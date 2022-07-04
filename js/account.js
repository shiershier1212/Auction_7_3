//页面加载时。执行方法
window.onload = setUserInfo

let user = {
    id: 11111,
    name: "用户名字",
    phone_number: localStorage["nowLoginUserPhoneNumber"],
    money: "10000",
}

let goods = {
    id: null,
    name: "",
    description: "",
    sell_user_id: user.id,
    buy_user_id: null,
    min_prices: 1,
    max_prices: null,
    buyout_prices: 2,
    create_at: null,
    status: null,
    duration: 240,
    image_url: null
}

//初始化用户信息的方法
function setUserInfo() {
    axios.get("http://localhost:8081/users/" + localStorage["nowLoginUserPhoneNumber"])
            .then(res => {
                console.log(res)
                user.name = res.data.data.name
                user.money = res.data.data.money
                user.id = res.data.data.id
                goods.sell_user_id = user.id
            })
            .catch(res => {
                console.log(res)
            })
}

let accountapp = new Vue({
    el: "#accountapp",
    data: {
        user: user,
        goods: goods,
        myGoodsList: [],
        dialogVisible: false,
        userInfoIsShow: true,
        MyGoodsInfoIsShow: false,
        GoodsReInfoIsShow: false,
        myGoodsControl: false,
        // show:[{userInfoIsShow: false},{MyGoodsInfoIsShow: false},{GoodsReInfoIsShow: false},{myGoodsControl:false}],
        // show:[false, false,false,false,false],
    },
    methods: {
        setUserInfo,
        setTheShow(i) {
            switch (i) {
                case 1:
                    this.userInfoIsShow = true
                    this.MyGoodsInfoIsShow = false
                    this.GoodsReInfoIsShow = false
                    this.myGoodsControl = false
                    break
                case 2:
                    let that = this
                    axios.get("http://localhost:8081/goods/" + user.id)
                            .then(res => {
                                console.log(res)
                                that.myGoodsList = res.data.data
                            })
                            .catch(res => {
                                console.log(res)
                            })
                    this.userInfoIsShow = false
                    this.MyGoodsInfoIsShow = true
                    this.GoodsReInfoIsShow = false
                    this.myGoodsControl = false
                    break
                case 3:
                    this.userInfoIsShow = false
                    this.MyGoodsInfoIsShow = false
                    this.GoodsReInfoIsShow = true
                    this.myGoodsControl = false
                    break
                case 4:
                    let t = this
                    axios.get("http://localhost:8081/goods/" + user.id)
                            .then(res => {
                                console.log(res)
                                t.myGoodsList = res.data.data
                            })
                            .catch(res => {
                                console.log(res)
                            })
                    this.userInfoIsShow = false
                    this.MyGoodsInfoIsShow = false
                    this.GoodsReInfoIsShow = false
                    this.myGoodsControl = true
                    break
            }
        },
        submitForm() {
            //注册商品
            if (goods.name === "" || goods.description === "" || goods.min_prices === "" || goods.buyout_prices === "") {
                alert("请输入完整的信息！")
            }
            axios.post("http://localhost:8081/goods", this.goods)
                    .then(res => {
                        console.log(res)
                        this.$message({message: "商品注册成功！", type: "success"});
                    })
                    .catch(res => {
                        console.log(res)
                        this.$message.error("商品注册失败！");
                    })
        },
        resetForm() {
            goods.name = ""
            goods.description = ""
            goods.min_prices = 1
            goods.buyout_prices = 2
            goods.duration = 240
        },
        // getMyAllGoods() {
        //     let that = this
        //     axios.get("http://localhost:8081/goods/" + this.user.id)
        //             .then(res => {
        //                 console.log(res)
        //                 that.myGoodsList = res.data.data
        //             })
        //             .catch(res => {
        //                 console.log(res)
        //             })
        // },
        outLogin() {
            window.location.href = "login.html"
        }
    },
})


