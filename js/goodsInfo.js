let thisGoodsId = localStorage["nowGoodId"]//当前页面的商品id
let c
let goodsInfoApp = new Vue({
    el: "#goodsInfoApp",
    data: {
        time: {
            d: 0,
            h: 0,
            m: 0,
            s: 0,
        },
        nowUserId:localStorage['nowLoginUserId'],
        dialogVisible: false,
        dialogVisibleBuyout: false,
        mybidprices: 100,
        user: null,
        goods: null,
        thisGoodsMaxPrices: 0,
        auctionsList: [],
        canbid: true,
        search:"",
        isMyGoods:false,
    },
    methods: {
        setTheGoods() {
            let that = this
            // 设置该商品的全部信息
            axios.get("http://localhost:8081/goods/getbyid/" + thisGoodsId)
                    .then(res => {
                        if (res.data.status === "ok") {
                            that.thisGoodsMaxPrices = res.data.data.max_prices
                            that.goods = res.data.data//设置商品信息
                            that.canbid = res.data.data.status === "正进行"//看是否可以拍卖
                            if(res.data.data.sell_user_id === parseInt(localStorage["nowLoginUserId"])){that.isMyGoods=true}
                        } else {
                            console.log(res.data.data)
                        }
                    })
                    .catch(res => {
                        console.log(res)
                    })

            // 获取当前商品的竞拍记录
            axios.get("http://localhost:8081/auctions/getbygoodsid/" + thisGoodsId)
                    .then(res => {
                        if (res.data.status === "ok") {
                            this.auctionsList = res.data.data
                            // console.log(this.auctionsList)
                            this.auctionsList.sort(function (a, b) {
                                return b.buy_user_prices - a.buy_user_prices
                            })
                            // that.thisGoodsMaxPrices = this.auctionsList[0].buy_user_prices
                        } else {
                            console.log(res.data.data)
                        }
                    })
                    .catch(res => {
                        console.log(res)
                    })
        },
        // 该方法是在页面更新倒计时
        getTheCountDownTime() {
            if (this.goods.finished_at == null) clearInterval(c)
            let EndTime = new Date(this.goods.finished_at)
            let NowTime = new Date();
            let t = EndTime.getTime() - NowTime.getTime()
            if (t <= 0) {
                this.endTheAuctions()
                this.canbid = false
                clearInterval(c)
                return
            }
            this.time.d = Math.floor(t / 1000 / 60 / 60 / 24)
            this.time.h = Math.floor(t / 1000 / 60 / 60 % 24)
            this.time.m = Math.floor(t / 1000 / 60 % 60)
            this.time.s = Math.floor(t / 1000 % 60)
        },

        // 在打开页面时更新，结束拍卖
        endTheAuctions() {
            console.log("结束拍卖")
            if (this.goods.status === "正进行" && this.goods.buy_user_id === 0) {
                let goodsUpdate
                if(this.auctionsList[0]==null){
                    goodsUpdate = {
                        id: this.goods.id,
                        status: "已结束",
                        deal_at: new Date().getTime()
                    }
                }else {
                    goodsUpdate = {
                        id: this.goods.id,
                        buy_user_id: this.auctionsList[0].buy_user_id,
                        max_prices: this.auctionsList[0].buy_user_prices,
                        status: "已结束",
                        deal_at: new Date().getTime()
                    }
                }

                axios.put("http://localhost:8081/goods/updateById", goodsUpdate)
                        .then(res => {
                            console.log(res.data)
                        })
                if(this.auctionsList[0]==null){
                    return
                }

                // 更新成功拍者的账户
                let user = {
                    id: this.auctionsList[0].buy_user_id,
                    money: this.auctionsList[0].buy_user_prices//这个钱其实是花费的钱
                }
                axios.put("http://localhost:8081/users/updateMoney", user)
                        .then(res => {
                            console.log(res.data)
                        })
                        .catch(res => {
                            console.log(res.data)
                        })

                let au = {
                    goods_id: this.goods.id,
                    status: "已结束"
                }

                //更新记录表中拍卖记录的状态
                axios.put("http://localhost:8081/auctions", au)
                        .then(res => {
                            console.log(res.data)
                        })
                        .catch(res => {
                            console.log(res.data)
                        })
            }
        },
        bidGoods() {
            let that = this
            // 竞价操作,点击参与竞价时触发
            if (this.canbid === false) {
                this.$message.error("该商品已经结束拍卖啦！");
                return
            }
            if (this.mybidprices <= this.thisGoodsMaxPrices) {
                this.$message.error("竞拍价格需要大于当前价格！");
                return
            }
            if (this.isMyGoods === true) {//
                this.$message.error("不能竞拍自己的商品！");
                return
            }
            if(this.mybidprices >= this.goods.buyout_prices){//如果竞价的价格大于买断价格，那么就进入买断事件
                this.buyoutTheGoods()
                this.dialogVisible = false
                return
            }
            let myauctions = {
                goods_id: this.goods.id,
                sell_user_id: this.goods.sell_user_id,
                buy_user_id: localStorage["nowLoginUserId"],
                buy_user_prices: this.mybidprices
            }
            //往竞拍记录表中添加信息
            axios.post("http://localhost:8081/auctions", myauctions)
                    .then(res => {
                        console.log(res)
                        if (res.data.status === "ok") {
                            this.$message({message: "参与竞拍成功！", type: "success"})
                            that.dialogVisible = false
                        } else {
                            this.$message.error("参与竞拍失败啦！")
                            that.dialogVisible = false
                        }
                    })
            //修改当前商品的价格最大值
            let cg = {
                id: this.goods.id,
                max_prices: this.mybidprices
            }
            axios.put("http://localhost:8081/goods/updateById", cg)
                    .then(res => {
                        console.log(res.data)
                        window.location.href="goodsInfo.html"
                    })
        },

        // 买断商品
        buyoutTheGoods() {
            this.dialogVisible = false
            // console.log("买断")
            if (this.canbid === false) {
                this.$message.error("该商品已经结束拍卖啦！");
                return
            }
            if (this.mybidprices <= this.thisGoodsMaxPrices) {
                this.$message.error("竞拍价格需要大于当前价格！");
                return
            }
            if (this.isMyGoods === true) {//
                this.$message.error("不能竞拍自己的商品！");
                return
            }

            this.mybidprices = this.goods.buyout_prices

            let myauctionso = {
                goods_id: this.goods.id,
                sell_user_id: this.goods.sell_user_id,
                buy_user_id: localStorage["nowLoginUserId"],
                buy_user_prices: this.mybidprices
            }
            //往竞拍记录表中添加信息
            axios.post("http://localhost:8081/auctions", myauctionso)
                    .then(res => {
                        console.log(res)
                        if (res.data.status === "ok") {
                            this.$message({message: "参与竞拍成功！", type: "success"})
                            that.dialogVisible = false
                        } else {
                            this.$message.error("参与竞拍失败啦！")
                            that.dialogVisible = false
                        }
                    })

            //更改商品的信息
            let g = {
                id: this.goods.id,
                buy_user_id: localStorage["nowLoginUserId"],
                max_prices: this.mybidprices,
                finished_at: new Date(),
                status: "已结束"
            }
            axios.put("http://localhost:8081/goods/updateById", g)
                    .then(res => {
                        console.log(res.data)
                    })
                    .catch(res => {
                        console.log(res, data)
                        this.$message({message: "买断商品成功！", type: "success"})
                    })

            let au = {
                goods_id: this.goods.id,
                status: "已完成"
            }
            //更新记录表中拍卖记录的状态
            axios.put("http://localhost:8081/auctions", au)
                    .then(res => {
                        console.log(res.data)
                    })
                    .catch(res => {
                        console.log(res.data)
                    })
            let u = {
                id:localStorage["nowLoginUserId"],
                money:this.mybidprices
            }
            axios.put("http://localhost:8081/users/updateMoney", u)
                    .then(res => {
                        console.log(res.data)
                        window.location.href="goodsInfo.html"
                    })
            this.dialogVisibleBuyout = false
        },
        // 跳转到搜索页面
        goToTheSearchPage(){
            window.location.href="searchPage.html"
        },
        //设置竞价表中胜出者颜色
        tableRowClassName({row,rowIndex}){
            if(rowIndex === 0){
                return 'success-row'
            }else {
                return 'warning-row'
            }
        }
    },
    mounted() {
        window.updateSocket = this.setTheGoods
        window.updateSocket = this.getTime
        this.setTheGoods()//页面一加载就执行该方法，设置好商品数据和竞拍记录
        c = setInterval(this.getTheCountDownTime, 1000)//一直更新倒计时
    },
    beforeDestroy() {
        clearInterval()
    },
})

