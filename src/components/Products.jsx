import React, {useState} from 'react'
import Header from './UI-Components/Header'
import Sidebar from "./UI-Components/Sidebar";
import Footer from "./UI-Components/Footer";
import ProductModal from "./UI-Components/ProductModal";
import {
  Button,
  Pagination,
  TextBox,
  Checkbox,
} from "../core/components";
import {Dropdown} from "../core/components";

import {
  Table,
  Row,
  ItemCell,
  HeaderCell,
  LinkCell,
} from "../core/components";
import { Modal } from "../core/components";



const Products = () => {
    const [toggle1, setToggle1] = useState(false);
    const [allgoals, setAllgoals] = useState("All goal types")
    const [modal1Open, setModal1Open] = useState(false);
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
         <div class="main-conetnt flex">
            {/* Side Bar */}
            <div className="sidemenu">
            <Sidebar/>
            </div>
            <div class="content-wrapper">
                <div class="order-heading-block sm:flex justify-between mb-block">
                    <h2 class="heading">Products</h2>
                    <div className="products-btn-group sm:flex justify-end items-center">
                      <Button className="btn-delete disabled-state" red>Delete selected</Button>
                      <Button className="primary-btn disabled-state" >Move selected...</Button>
                      <Button className="primary-btn"><i class="fas fa-plus-circle"></i>New Folder</Button>
                      <Button className="primary-btn"><i class="fas fa-plus-circle"></i>New Product</Button>
                    </div> 
                </div>
                <div class="products-block">
                    <div class="products-subheading">
                        <h3>/Products</h3>
                    </div>
                    <div class="products-block-inside">
                    <form action="" method="">
                      <div class="orders-filter sm:flex justify-between item-center">
                          <TextBox
                            prependIcon="fas fa-search"
                            className="order-search"
                            placeholder="Search products"
                            defaultValue=""
                          />
                          <Dropdown
                            className="all-orders"
                            value={allgoals}
                            onChange={setAllgoals}
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
                          <ItemCell className="col-span-3 folder-lable">
                            <Checkbox className="cstm-checkbox" value={toggle1} onChange={setToggle1} /> 
                            <span><i class="fas fa-folder-open"></i> Impression-Based</span></ItemCell>
                          <ItemCell className="text-black">Folder</ItemCell>
                          <ItemCell className="text-black">2 folders, 3 products</ItemCell>
                        </Row>
                        <Row>
                          <ItemCell className="col-span-3 folder-lable">
                            <Checkbox className="cstm-checkbox" value={toggle1} onChange={setToggle1} /> 
                            <span><i class="fas fa-folder-open"></i> Time-Based</span></ItemCell>
                          <ItemCell className="text-black">Folder</ItemCell>
                          <ItemCell className="text-black">2 folders</ItemCell>
                        </Row>
                        <Row>
                          <ItemCell className="col-span-3 folder-lable">
                            <Checkbox className="cstm-checkbox" value={toggle1} onChange={setToggle1} /> 
                            <span><i class="fas fa-folder-open"></i> Under Consideration</span></ItemCell>
                          <ItemCell className="text-black">Folder</ItemCell>
                          <ItemCell className="text-black">4 products</ItemCell>
                        </Row>
                        <Row>
                          <ItemCell className="col-span-3 folder-lable">
                            <Checkbox className="cstm-checkbox" value={toggle1} onChange={setToggle1} /> 
                            <span><i class="fas fa-folder-open"></i> Archived</span></ItemCell>
                          <ItemCell className="text-black">Folder</ItemCell>
                          <ItemCell className="text-black">0 children</ItemCell>
                        </Row>
                        <Row>
                          <ItemCell className="col-span-3 folder-lable">
                            <Checkbox className="cstm-checkbox" value={toggle1} onChange={setToggle1} /> 
                            <span onClick={() => setModal1Open(true)}><i class="fas fa-file-alt document-icon"></i> Seoul/Lotte - 250 Plays/Screen</span></ItemCell>
                          <ItemCell className="text-black">Product</ItemCell>
                          <ItemCell className="text-black">-</ItemCell>
                        </Row>
                       </Table> 
                       <Modal
                          open={modal1Open}
                          onClose={() => setModal1Open(false)}
                          header={<h1 className="prducts-dialoge-header">Edit "Seoul/Lotte - 250 Plays/Screen"</h1>}
                          className="prducts-dialoge"
                      >
                        <ProductModal/>
                        </Modal>
                      </div> 
                  {/* <div className="products-table">
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
                            <td><Checkbox className="" value={toggle1} onChange={setToggle1} /></td>
                            <td class="w-50 blue-text"><i class="fas fa-folder-open"></i> Impression-Based</td>
                            <td>Folder</td>
                            <td>2 folders, 3 products</td>
                        </tr>
                        <tr>
                            <td><Checkbox className="" value={toggle1} onChange={setToggle1} /></td>
                            <td class="w-50 blue-text"><i class="fas fa-folder-open"></i> Time-Based</td>
                            <td>Folder</td>
                            <td>2 folders</td>
                        </tr>
                        <tr>
                            <td><Checkbox className="" value={toggle1} onChange={setToggle1} /></td>
                            <td class="w-50 blue-text"><i class="fas fa-folder-open"></i> Under Consideration</td>
                            <td>Folder</td>
                            <td>4 products</td>
                        </tr>
                        <tr>
                            <td><Checkbox className="" value={toggle1} onChange={setToggle1} /></td>
                            <td class="w-50 blue-text"><i class="fas fa-folder-open"></i> Archived</td>
                            <td>Folder</td>
                            <td>0 children</td>
                        </tr>
                        <tr>
                            <td><Checkbox className="" value={toggle1} onChange={setToggle1} /></td>
                            <td class="w-50 blue-text" onClick={() => setModal1Open(true)}><i class="fas fa-file-alt document-icon"></i> Seoul/Lotte - 250 Plays/Screen</td>
                            <td>Product</td>
                            <td>-</td>
                        </tr>
                    </tbody>
                    </table>
                    <Modal
                      open={modal1Open}
                      onClose={() => setModal1Open(false)}
                      header={<h1 className="prducts-dialoge-header">Edit "Seoul/Lotte - 250 Plays/Screen"</h1>}
                      className="prducts-dialoge"
                  >
                    <ProductModal/>
                    </Modal>
                   
                  </div>  */}
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

export default Products
