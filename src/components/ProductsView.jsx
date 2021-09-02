import React, {useState} from 'react'
import Header from './UI-Components/Header'
import Sidebar from "./UI-Components/Sidebar";
import Footer from "./UI-Components/Footer";
import {
  Button,
  Pagination,
  TextBox,
  Checkbox,
} from "../core/components";
import {
  Dropdown,
} from "../core/components";


const ProductsView = () => {
    const [toggle1, setToggle1] = useState(false);
    const [status, setStatus] = useState("All goal types")
    return (
        <>
             {/* header */}
      <Header/>
      {/* Search filter for mobile */}
      <TextBox
            prependIcon="fas fa-search"
            className="global-search mobile-filter"
            placeholder="Search orders, products and more"
            defaultValue=""
            />
       {/*Orders Main Conetnt */}
       <div class="main-layout">
         <div class="main-conetnt">
            {/* Side Bar */}
            <div className="sidemenu">
            <Sidebar/>
            </div>
            <div class="content-wrapper">
                <div class="order-heading-block">
                    <h2 class="heading">Products</h2>
                    <div className="products-btn-group">
                      <Button className="btn-delete disabled-state" red>Delete selected</Button>
                      <Button className="primary-btn disabled-state" >Move selected...</Button>
                      <Button className="primary-btn"><i class="fas fa-plus-circle"></i>New Folder</Button>
                      <Button className="primary-btn"><i class="fas fa-plus-circle"></i>New Product</Button>
                    </div> 
                </div>
                <div class="products-block">
                    <div class="products-subheading">
                        <h3><span>/Products</span> <i class="fas fa-caret-right"></i>Impression-Based</h3>
                    </div>
                    <div class="products-block-inside">
                    <form action="" method="">
                  <div class="orders-filter">
                      <TextBox
                        prependIcon="fas fa-search"
                        className="order-search"
                        placeholder="Search products"
                        defaultValue=""
                      />
                      <Dropdown
                        className="all-orders"
                        value={status}
                        onChange={setStatus}
                        options={["All goal types", "type1", "type2"]}
                        invalid
                      />
                  </div>
                  </form> 
                  <div className="products-table">
                  <table class="table">
                    <thead>
                        <tr>
                        <th></th>
                        <th class="sort">Name</th>
                        <th>Type</th>
                        <th>Children</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td colspan="3"><i class="fas fa-upload"></i> One folder up...</td>
                        </tr>
                        <tr>
                            <td><Checkbox className="" value={toggle1} onChange={setToggle1} /></td>
                            <td><i class="fas fa-folder-open"></i> Seoul</td>
                            <td>Folder</td>
                            <td>2 folders</td>
                        </tr>
                        <tr>
                            <td><Checkbox className="" value={toggle1} onChange={setToggle1} /></td>
                            <td><i class="fas fa-folder-open"></i> New York</td>
                            <td>Product</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td><Checkbox className="" value={toggle1} onChange={setToggle1} /></td>
                            <td><i class="fas fa-file-alt document-icon"></i> London - 5% DSOV/Screen</td>
                            <td>Product</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td><Checkbox className="" value={toggle1} onChange={setToggle1} /></td>
                            <td><i class="fas fa-file-alt document-icon"></i> London - 5% DSOV</td>
                            <td>Product</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td><Checkbox className="" value={toggle1} onChange={setToggle1} /></td>
                            <td><i class="fas fa-file-alt document-icon"></i> London - 250 Plays/Screen</td>
                            <td>Gateway Node</td>
                            <td>4</td>
                        </tr>
                    </tbody>
                    </table>
                  </div> 
                  <div className="product-table-pagination">
                  <Pagination
                    hasNext={false}
                    hasPrev={false}
                    nextPage={() => {}}
                    prevPage={() => {}}
                  >
                    Page 1/1
                 </Pagination>
                  </div> 
                 
                    </div>
                    
                </div>
              
              {/* Footer */}
              <div className="inside-footer">
              <Footer />
              </div>
            </div>
         </div>
       </div>
        </>
    )
}

export default ProductsView
