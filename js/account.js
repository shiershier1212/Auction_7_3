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

        myGoodsList: [],//我注册的商品
        myOwnGoodsList: [],//我拍卖到的商品
        myAuctionsObj:[],//我参与的拍卖

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
                        //获取自己注册的商品
                    axios.get("http://localhost:8081/goods/" + user.id)
                            .then(res => {
                                console.log(res)
                                that.myGoodsList = res.data.data
                            })
                            .catch(res => {
                                console.log(res)
                            })

                        //获取自己购买到的商品
                    axios.get("http://localhost:8081/goods/mybuy/" + user.id)
                            .then(res => {
                                console.log(res)
                                that.myOwnGoodsList = res.data.data
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
                        //获取自己注册的商品
                    axios.get("http://localhost:8081/goods/" + user.id)
                            .then(res => {
                                console.log(res)
                                t.myGoodsList = res.data.data
                            })
                            .catch(res => {
                                console.log(res)
                            })
                        // 获取自己的竞拍记录
                    axios.get("http://localhost:8081/auctions/myin/" + user.id)
                            .then(res => {
                                console.log(res)
                                t.myAuctionsObj = res.data.data
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
                this.$message.error("请输入完整的信息！");
                return;
            }
            if (goods.min_prices > goods.buyout_prices) {
                this.$message.error("买断价格不能低于起拍价格！");
                return;
            }
            axios.post("http://localhost:8081/goods", this.goods)
                    .then(res => {
                        console.log(res)
                        if (res.data.status === "ok") {
                            this.$message({message: "商品注册成功！", type: "success"});
                        } else {
                            this.$notify({
                                title: '注册商品失败',
                                message: res.data.data,
                                duration: 0
                            });
                        }
                    })
                    .catch(res => {
                        console.log(res)
                        this.$message.error("商品注册失败！" + res.data.data);
                    })
        },
        resetForm() {
            goods.name = ""
            goods.description = ""
            goods.min_prices = 1
            goods.buyout_prices = 2
            goods.duration = 240
        },
        outLogin() {
            window.location.href = "login.html"
        },
        handleDeal(index, row) {
            //index是下标，row是这一行的数据
            // console.log(index)
            // console.log(row.id)
            if (row.status === 1) {
                //如果此商品正在拍卖，那么结束拍卖，得出赢家
                row.status = 2
            }
        },
        handleDelete(index, row) {
            //删除该商品的记录
            if (row.status === 2) {
                axios.delete("http://localhost:8081/goods/" + row.id)
                        .then(res => {
                            if (res.data.status === "ok") {
                                this.$message({message: "删除成功！", type: "success"})
                            } else {
                                console.log(res)
                                this.$message.error("删除失败！")
                            }
                        })
                        .catch(res => {
                            console.log(res)
                            this.$message.error("删除失败！")
                        })
            } else if (row.status === 1) {
                this.$message.error("商品还未结束拍卖！")
            }
        }


    },
})


