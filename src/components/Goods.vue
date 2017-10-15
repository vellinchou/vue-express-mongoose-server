<template>
  <div>
    <div class="goods-filter">
      
      <div class="filter-item">
        <el-button type="primary" @click="startPriceSort">
          <span v-show="priceSort == -1">价格升序</span>
          <span v-show="priceSort == 1">价格降序</span>
        </el-button>
        <el-button type="primary" @click="startSort">
          <span v-show="timeSort == -1">时间升序</span>
          <span v-show="timeSort == 1">时间降序</span>
        </el-button>
      </div>

      <div class="filter-item">
        <input type="number" v-model="pricegt" class="filter-input" placeholder="0"> -
        <input type="number" v-model="pricelt" class="filter-input" placeholder="100">
        <el-button type="primary" @click="filterPrice">价格过滤</el-button>
      </div>

      <div class="filter-item">
        <input type="text" v-model="keywords">
        <el-button type="primary" @click="searchKeywords">搜索</el-button>
      </div>

    </div>
    <div class="goods-container clearfix">
      <div class="good-item" v-for="(item, $index) in goods">
        <p class="title">{{item.title || '暂无商品名'}}</p>
        <p class="price">￥{{item.price}}</p>
        <p class="tags">{{item.keywords}}</p>
        <p class="tags">{{new Date(item.createTime).toLocaleString()}}</p>
        <el-button type="success" icon="plus" @click="addToCart(item._id)"></el-button>
        <el-button type="primary" icon="edit" @click="editGood(item)"></el-button>
        <el-button type="danger" icon="delete" @click="removeGood(item._id)"></el-button>
      </div>
    </div>

    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page.sync="page" :page-size="size"
      :total="total">
    </el-pagination>

    <el-dialog title="编辑商品" :visible.sync="dialogFormVisible" size="tiny">
      <el-form :model="form">
        <el-form-item label="商品名称" >
          <el-input v-model="form.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" >
          <el-input v-model="form.price" type="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editItemApi">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import requestApi from './../services/request.api.js'
export default {
  data () {
    return {
      goods: [],
      priceSort: 1,
      timeSort: 1,
      page: 1,
      size: 8,
      pricelt: 0 ,
      pricegt: 0 ,
      keywords: "",
      total: 8,
      dialogFormVisible: false ,
      form: {
        title: "" ,
        price: null
      },
      editId: null
    }
  },
  mounted () {
    this.getGoods()
  },
  methods: {
    getGoods (priceSort, timeSort) {
      var params = {
        page: this.page,
        size: this.size,
        sort: {}
      }

      if (priceSort !== null) {
        params.sort = { price: this.priceSort }
      }

      if (timeSort !== null) {
        params.sort = { createTime: this.timeSort }
      }
      
      if (this.pricelt > 0) {
        params.pricelt = this.pricelt
        params.pricegt = this.pricegt
      }

      if (this.keywords) {
        params.keywords = this.keywords
      }

      requestApi.getGoods(params)
       .then(res => {
         this.goods = res.data.data.data
         this.total = res.data.data.total
       })
       .catch(err => {
         console.log(err)
       })
    },

    handleCurrentChange(val) {
      this.page = val
      this.getGoods()
    },

    addToCart(){

    },

    editGood(item) {
      this.dialogFormVisible = true 
      this.form = Object.assign(item, {})
      this.editId = item._id
    },

    editItemApi() {
      if (this.editId) {
        const { title, price } = this.form
        requestApi.editGood(this.editId, { title, price })
        .then(res => {
          if (res.data.status) {
            this.getGoods()
             this.dialogFormVisible = false
          } else {
            
          }
        })
        .catch(err => {
          console.log(err)
        })
      }  
    },

    removeGood(id){
      requestApi.removeGood(id)
       .then(res => {
         if(res.data.status) {
           this.getGoods()
         }
       })
       .catch(err => {
         console.log(err)
       })
    },

    filterPrice() {
      this.page = 1 ;
      this.getGoods()
    },

    searchKeywords() {
      this.page = 1 
      this.getGoods()
    },

    startSort() {
      this.timeSort == 1 ? this.timeSort = -1 : this.timeSort = 1
      this.page = 1
      this.getGoods(null, {createTime: this.timeSort})
    } ,
    startPriceSort() {
      this.priceSort == 1 ? this.priceSort = -1 : this.priceSort = 1
      this.page = 1
      this.getGoods({price: this.priceSort}, null)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .goods-container {
    width: 75% ;
    margin: 0 auto ;
  }
   .goods-filter　{
     width: 75% ;
     margin: 0 auto ;
     background:#eee ;
     display: flex;
     justify-content: space-around ;
   }
  .good-item {
    width: 200px;
    height: 240px;
    border: 1px solid gray;
    float: left;
    margin: 10px;
    text-aligin:left;
    padding:4px 8px;
    .title {
      height: 50px
    }
    .tags {
      font-size: 10px
    }
    .price {
      width: 80px;
      height: 24px;
      line-height: 24px;
      margin: 0 auto;
      border: 1px solid tomato;
      background: #ddd;
      color: tomato;
      text-align: center;
    }
  }
  
  .startSort {}
  
  .filter-input {
    width: 80px;
  }
  
  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden
  }
  
  .clearfix {
    height: 1%;
  }
</style>