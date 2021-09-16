import React, {useState} from 'react'
import {
    Button,
    Pagination,
    TextBox,
    Checkbox,
  } from "../../core/components";
import {Dropdown} from "../../core/components";
import {
    Table,
    Row,
    ItemCell,
    HeaderCell,
    LinkCell,
  } from "../../core/components";

const ProductModal = () => {
    const [status, setStatus] = useState("All statuses")
    const [goal, setGoal] = useState("Plays/Screen")
    const [time, setTime] = useState("Secounds")
    
    return (
        <>
       <TextBox className="entry-filed sm:w-3/5" label="Name" defaultValue="Seoul/Lotte - 250 Plays/Screen" />
       <div className="cstm-textarea mt-5">
            <label>Description</label>
            <textarea class="resize border rounded-md w-full border-gray-300" value="Regular notation across all the inventory in Lotte stores located in the Seoul market, guaranteeing 250 plays per day per screen across the rotation."></textarea>
       </div>
        <div class="divider my-6"></div>
        <div class="sm:flex">
            <div class="sm:w-2/5 sm:mr-10">
              <Dropdown
                className="w-full entry-dropdown"
                label="Goal Type"
                value={goal} onChange={setGoal} options={["Plays/Screen", "Goal", "Goal1"]} />
            </div>
            <div class="sm:w-1/6 sm:mr-10 m-t-20-mobile">
                <TextBox
                    className="entry-filed"
                    label="Value"
                    defaultValue="250"
                />
            </div>
            <div class="sm:w-1/6 sm:mr-2 m-t-20-mobile">
                <TextBox
                    className="entry-filed"
                    label="Nominal ad length"
                    defaultValue="8"
                />
            </div>
            <div class="sm:w-1/6 mt-5 m-t-20-mobile">
              <Dropdown
                className="w-full entry-dropdown"
                value={time} onChange={setTime} options={["Secounds", "Minuties", "Hours"]} />
            </div>
        </div>
        <div class="divider my-6"></div>
        <div class="custom-section">
            <div class="custom-section-header flex justify-between items-center">
                <h4>inventory</h4>
                <a href="">+ ADD NEW ITEM</a>
            </div>
            <div class="custom-section-body">
                <div class="orders-filter sm:flex justify-between items-center">
                    <TextBox
                        prependIcon="fas fa-search"
                        className="order-search"
                        placeholder="Search items"
                        defaultValue=""
                    />
                    <Dropdown
                        className="all-orders"
                        value={status}
                        onChange={setStatus}
                        options={["All statuses", "status1", "status2"]}
                    />
                </div>
                <div className="order-table">
                  <Table cols="grid-cols-5">
                    <Row>
                    <HeaderCell>Item</HeaderCell>
                    <HeaderCell>Group</HeaderCell>
                    <HeaderCell>Target(s)</HeaderCell>
                    <HeaderCell>Market</HeaderCell>
                    <HeaderCell>Status</HeaderCell>
                    </Row>
                    <Row>
                    <LinkCell className="blue-text">Inventory #1</LinkCell>
                    <ItemCell>Cumberland Farms</ItemCell>
                    <ItemCell>All stores – Entrance Displays (HTML)</ItemCell>
                    <ItemCell>Boston, MA</ItemCell>
                    <ItemCell className="light-gray-text"><span className="status"></span>Reserved</ItemCell>
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
        <div class="sm:flex justify-between mt-5">
                <div class="action-buutons sm:flex sm:w-1/2">
                <Button className="move-to mr-3" secondary>
                  Move to...
                </Button>
                <Button className="delete" secondary>
                  Delete
                </Button>
                </div>
                <div class="update-buutons sm:flex sm:w-1/2 justify-end">
                <Button className="move-to mr-3" secondary>
                   Discard changes
                </Button>
                <Button className="save" secondary>Save changes</Button>
                </div>
            </div>
        </>
    )
}

export default ProductModal
