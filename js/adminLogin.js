let adminloginApp = new Vue({
    el: "#adminloginApp",
    data: {
        loginpn: "",
        loginps: "",
        admin: {
            name: "",
            phone_number: "",
            password: "",
        }
    },
    methods: {
        getPassword() {
            if(this.loginpn.substring(0,5)!=="admin"){
                this.$message.error("账号不存在，请检查账号！")
                return;
            }
            if (this.loginpn === "" || this.loginps === "") {
                this.$message.error("请输入账号或者密码！")
                return
            }
            let that = this
            axios.get("http://localhost:8081/users/" + this.loginpn)
                    .then(res => {
                        console.log(res)
                        if (res.data.data === null) {
                            this.$message.error("账号不存在，请检查账号！")
                            return
                        }
                        if (that.loginps === res.data.data.password) {
                            this.$message({message:"登录成功！",type:"success"})
                            window.location.href="adminController.html"
                            localStorage.nowLoginAdminId = res.data.data.id//使得管理员可以进入
                        } else {
                            this.$message.error("登录失败，请检查账号或者密码！")
                        }
                    })
                    .catch(res => {
                        console.log(res)
                        this.$message.error("请求失败！")
                    })
        },
    }
})



