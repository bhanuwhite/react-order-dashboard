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
       
        <div class="row">
            <div class="col-md-7">
                <TextBox className="entry-filed" label="Name" defaultValue="Seoul/Lotte - 250 Plays/Screen" />
            </div>
            <div class="col-md-12">
                <div class="form-group m-t-14 cstm-textarea">
                    <label for="description">Description</label>
                    <textarea class="form-control" id="description" rows="3"
                    value="Regular notation across all the inventory in Lotte stores located in the Seoul market, guaranteeing 250 plays per day per screen across the rotation."></textarea>
                </div>
           </div>
        </div>
        <div class="divider m-tb-8"></div>
        <div class="row mb-4">
            <div class="col-md-5">
              <Dropdown
                className="w-full entry-dropdown m-t-20"
                label="Goal Type"
                value={goal} onChange={setGoal} options={["Plays/Screen", "Goal", "Goal1"]} />
            </div>
            <div class="col-md-3">
                <TextBox
                    className="entry-filed m-t-20"
                    label="Value"
                    defaultValue="250"
                    invalid
                />
            </div>
            <div class="col-md-2">
                <TextBox
                    className="entry-filed m-t-20"
                    label="Nominal ad length"
                    defaultValue="8"
                    invalid
                />
            </div>
            <div class="col-md-2">
              <Dropdown
                className="w-full entry-dropdown m-t-40"
                value={time} onChange={setTime} options={["Secounds", "Minuties", "Hours"]} />
            </div>
        </div>
        <div class="divider m-tb-8"></div>
        <div class="custom-section mt-4">
            <div class="custom-section-header">
                <h4>inventory</h4>
                <a href="">+ ADD NEW ITEM</a>
            </div>
            <div class="custom-section-body">
                <div class="orders-filter">
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
                        invalid
                    />
                </div>
                <div className="order-table product-popup-table">
                  <Table cols="grid-cols-5 table-responsive">
                    <Row>
                    <HeaderCell>Item</HeaderCell>
                    <HeaderCell>Group</HeaderCell>
                    <HeaderCell>Target(s)</HeaderCell>
                    <HeaderCell>Market</HeaderCell>
                    <HeaderCell>Status</HeaderCell>
                    </Row>
                    <Row>
                    <LinkCell>Inventory #1</LinkCell>
                    <ItemCell>Cumberland Farms</ItemCell>
                    <ItemCell>All stores – Entrance Displays (HTML)</ItemCell>
                    <ItemCell>Boston, MA</ItemCell>
                    <ItemCell><span className="status"></span>Reserved</ItemCell>
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
        <div class="popup-buttons mt-4">
                <div class="action-buutons">
                <Button className="move-to mr-3" secondary>
                  Move to...
                </Button>
                <Button className="delete" secondary>
                  Delete
                </Button>
                </div>
                <div class="update-buutons">
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
