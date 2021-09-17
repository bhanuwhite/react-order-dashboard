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
import {
  Table,
  Row,
  ItemCell,
  HeaderCell,
  LinkCell,
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
            className="mobile-filter sm:hidden"
            placeholder="Search orders, products and more"
            defaultValue=""
            />
       {/*Orders Main Conetnt */}
       <div class="bg-clear-white">
         <div class="main-conetnt flex">
            {/* Side Bar */}
            <div className="sidemenu">
            <Sidebar/>
            </div>
            <div class="content-wrapper">
                <div class="order-heading-block sm:flex justify-between items-center">
                    <h2 class="heading">Products</h2>
                    <div className="products-btn-group sm:flex justify-end">
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
                  <div class="orders-filter sm:flex justify-between items-center">
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
                      />
                  </div>
                  </form> 
                  <div className="order-table">
                      <Table cols="grid-cols-5">
                        <Row>
                          <HeaderCell className="col-span-3 pl-9">Name</HeaderCell>
                          <HeaderCell>Type</HeaderCell>
                          <HeaderCell>Children</HeaderCell>
                        </Row>
                        <Row>
                          <ItemCell className="col-span-5 folder-lable">
                            <span className="pl-9"><i class="fas fa-upload"></i> One folder up...</span></ItemCell>
                        </Row>
                        <Row>
                          <ItemCell className="col-span-3 folder-lable">
                            <Checkbox className="cstm-checkbox" value={toggle1} onChange={setToggle1} /> 
                            <span><i class="fas fa-folder-open"></i> Seoul</span></ItemCell>
                          <ItemCell className="text-black">Folder</ItemCell>
                          <ItemCell className="text-black">2 folders</ItemCell>
                        </Row>
                        <Row>
                          <ItemCell className="col-span-3 folder-lable">
                            <Checkbox className="cstm-checkbox" value={toggle1} onChange={setToggle1} /> 
                            <span><i class="fas fa-folder-open"></i> New York</span></ItemCell>
                          <ItemCell className="text-black">Product</ItemCell>
                          <ItemCell className="text-black">-</ItemCell>
                        </Row>
                        <Row>
                          <ItemCell className="col-span-3 folder-lable">
                            <Checkbox className="cstm-checkbox" value={toggle1} onChange={setToggle1} /> 
                            <span><i class="fas fa-file-alt document-icon"></i> London - 5% DSOV/Screen</span></ItemCell>
                          <ItemCell className="text-black">Product</ItemCell>
                          <ItemCell className="text-black">-</ItemCell>
                        </Row>
                        <Row>
                          <ItemCell className="col-span-3 folder-lable">
                            <Checkbox className="cstm-checkbox" value={toggle1} onChange={setToggle1} /> 
                            <span><i class="fas fa-file-alt document-icon"></i> London - 5% DSOV</span></ItemCell>
                          <ItemCell className="text-black">Product</ItemCell>
                          <ItemCell className="text-black">-</ItemCell>
                        </Row>
                        <Row>
                          <ItemCell className="col-span-3 folder-lable">
                            <Checkbox className="cstm-checkbox" value={toggle1} onChange={setToggle1} /> 
                            <span><i class="fas fa-file-alt document-icon"></i> London - 250 Plays/Screen</span></ItemCell>
                          <ItemCell className="text-black">Gateway Node</ItemCell>
                          <ItemCell className="text-black">4</ItemCell>
                        </Row>
                       </Table> 
                      </div> 
                  <div className="table-pagination">
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
