import React, { Component, useState } from 'react';
import {Button, Form, FormGroup, Label, FormText, Input} from "reactstrap";
import FileBase64 from 'react-file-base64';
// import {FontAwesome} from '@fortawesome/react-fontawesome'; 
// import {faCoffee} from '@fortawesome/free-solid-svg-icons';

// function Upload (){
//     const [confirmation, setConfirmation] = useState();

//     const handleSubmit = (event)=>{
//         event.preventDefault();
//         setConfirmation("Uploading")
//     }
//     const processing = "Processing document... "
    
//     return (
//         <div className= "row">
//             <div className= "col-6 offset-3">
//                 <Form onSubmit= {this.handleSubmit}>
//                     <FormGroup>
//                         <h3 className="text-danger">{processing}</h3>
//                         <h6> Upload your invoice</h6>
//                         <FormText color="muted">PNG,JPG</FormText>
//                     </FormGroup>
                    
//                 </Form>
//             </div>
//         </div>
//     );
// }


class Upload extends React.Component {
    state ={
        confirmation: "",
        isLoading : "",
        files: "",
        Invoice : "",
        Amount: "",
        InvoiceDate: "", 
        Vendor: "",
        Description : ""
    }
    handleChange(event) {
        event.preventDefault();
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({name: value});

    }
    async handleSubmit(event){
        event.preventDefault();
        this.setState({confirmation: "Uploading..."})
    }
    async getFiles(files){
        this.setState({
            isLoading : "Extracting data",
            files: files
    });
    const UID=Math.round(1+ Math.random()*(10000000-1))
    var data  ={
        fileExt: "png",
        imageID: UID, 
        folder: UID,
        img: this.state.files[0].base64
    };
    this.setState({confirmation: "Processing..."})
    await fetch(
        "https://mzku1bgu21.execute-api.ap-northeast-2.amazonaws.com/Production",
        {
            method: "POST",
            headers:{
                Accept: "applications/json",
                "Content-Type": "application.json"
            },
            body: JSON.stringify(data)
        }
    );
    
    let targetImage = UID + ".png";
    const response = await fetch(
        "https://mzku1bgu21.execute-api.ap-northeast-2.amazonaws.com/Production/ocr",
        
        {
            method: "POST",
            headers:{
                Accept: "applications/json",
                "Content-Type": "application.json"
            },
            body: JSON.stringify(targetImage)
        }
    );
    this.setState({confirmation: ""})
    const OCRBODY = await response.json(); 
    console.log("OCRBODY", OCRBODY);
    console.log(OCRBODY.body[0]);

    this.setState({Amount: OCRBODY.body[0]})
    this.setState({Invoice: OCRBODY.body[1]})
    this.setState({InvoiceDate: OCRBODY.body[2]})

    }
    
    render() { 
        const processing = this.state.confirmation;
        return (
            <div className= "row">
                <div className= "col-6 offset-3">
                    <Form onSubmit= {this.handleSubmit}>
                        <FormGroup>
                            <h3 className="text-danger">{processing}</h3>
                            <h6> Upload your invoice</h6>
                            <FormText color="muted">PNG,JPG</FormText>

                            <div className= "form-group files color">
                                <FileBase64
                                multiple= {true}
                                onDone={this.getFiles.bind(this)}>
                                </FileBase64>
                            </div>
                        </FormGroup>

                        <FormGroup>
                            <Label>
                                <h6>
                                    Invoice
                                </h6>
                            </Label>
                            <Input
                                type = "text"
                                name = "invoice"
                                id = "Invoice"
                                required
                                value = {this.state.Invoice}
                                onChange={this.handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>
                                <h6>Amount ($)</h6>
                            </Label>
                            <Input
                                type = "text"
                                name = "Amount"
                                id = "Amount"
                                required
                                value = {this.state.Amount}
                                onChange={this.handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>
                                <h6>Date</h6>
                            </Label>
                            <Input
                                type = "text"
                                name = "Date"
                                id = "Date"
                                required
                                value = {this.state.InvoiceDate}
                                onChange={this.handleChange}
                            />
                        </FormGroup>


                        <FormGroup>
                            <Label>
                                <h6>Vendor</h6>
                            </Label>
                            <Input
                                type = "text"
                                name = "Vendor"
                                id = "Vendor"
                                required
                                value = {this.state.Vendor}
                                onChange={this.handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>
                                <h6>Description</h6>
                            </Label>
                            <Input
                                type = "text"
                                name = "Description"
                                id = "Description"
                                required
                                value = {this.state.Description}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <Button className= "btn btn-lg btn-block  btn-success">
                            Submit
                        </Button>
                        
                    </Form>
                </div>
            </div>
        );
    }
}
 
export default Upload;