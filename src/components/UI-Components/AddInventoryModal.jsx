import React, {useState} from 'react'
import {
    Button,
    Pagination,
    TextBox,
    Checkbox,
  } from "../../core/components";
  import {
    Dropdown,
  } from "../../core/components";
  import {
    Table,
    Row,
    ItemCell,
    HeaderCell,
    LinkCell,
  } from "../../core/components";

const AddInventoryModal = () => {
    const [toggle1, setToggle1] = useState(false);
    return (
        <>
          <div className="inventory-search sm:flex justify-between items-center">
            <div className="inventory-search-box sm:w-8/12">
                <TextBox
                prependIcon="fas fa-search"
                className="order-search"
                placeholder="Search items"
                defaultValue=""
                />
            </div>  
            <div className="content-view sm:w-4/12">
              <ul className="flex justify-end items-center m-t-20-mobile">
                  <li className="active"><a href="">List View</a></li>
                  <li><a href="">Map View</a></li>
              </ul>
            </div>
          </div> 
          <div className="inventory-table">
            <Table cols="grid-cols-7">
                <Row>
                    <HeaderCell></HeaderCell>
                    <HeaderCell>Group</HeaderCell>
                    <HeaderCell>Provider</HeaderCell>
                    <HeaderCell>Location</HeaderCell>
                    <HeaderCell>Format & Size</HeaderCell>
                    <HeaderCell>Units</HeaderCell>
                    <HeaderCell>Avail.</HeaderCell>
                </Row>
                <Row>
                    <ItemCell><Checkbox className="" value={toggle1} onChange={setToggle1} /></ItemCell>
                    <ItemCell>Mid Isles</ItemCell>
                    <ItemCell>Aldi Stores</ItemCell>
                    <ItemCell>City Centre</ItemCell>
                    <ItemCell>16x9 – 55"</ItemCell>
                    <ItemCell>5</ItemCell>
                    <ItemCell className="light-gray-text"><span className="status"></span>100%</ItemCell>
                </Row>
                <Row>
                    <ItemCell><Checkbox className="" value={toggle1} onChange={setToggle1} /></ItemCell>
                    <ItemCell>End Caps</ItemCell>
                    <ItemCell>Aldi Stores</ItemCell>
                    <ItemCell>City Centre</ItemCell>
                    <ItemCell>16x9 – 42"</ItemCell>
                    <ItemCell>7</ItemCell>
                    <ItemCell className="light-gray-text"><span className="status"></span>75%</ItemCell>
                </Row>
                <Row>
                    <ItemCell><Checkbox className="" value={toggle1} onChange={setToggle1} /></ItemCell>
                    <ItemCell>Main Entrance</ItemCell>
                    <ItemCell>Aldi Stores</ItemCell>
                    <ItemCell>City Centre</ItemCell>
                    <ItemCell>16x9 – 65"</ItemCell>
                    <ItemCell>2</ItemCell>
                    <ItemCell className="light-gray-text"><span className="status paused"></span>32%</ItemCell>
                </Row>
                <Row>
                    <ItemCell><Checkbox className="" value={toggle1} onChange={setToggle1} /></ItemCell>
                    <ItemCell>Checkout</ItemCell>
                    <ItemCell>Aldi Stores</ItemCell>
                    <ItemCell>City Centre</ItemCell>
                    <ItemCell>16x9 – 32"</ItemCell>
                    <ItemCell>20</ItemCell>
                    <ItemCell className="light-gray-text"><span className="status incomplete"></span>32%</ItemCell>
                </Row>
            </Table>
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
            <div className="update-btn">
            <Button className="primary-btn">Add 2 items to order</Button>
            </div>
          </div> 
        </>
    )
}

export default AddInventoryModal
