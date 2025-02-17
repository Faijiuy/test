import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Modal from "@material-ui/core/Modal";

import { connectToDatabase } from "../../util/mongodb";
import { ObjectId } from "bson";

export async function getServerSideProps(props) {
  const { db } = await connectToDatabase();
  let id = props.params.userId;

  if (id !== "create") {
    const user = await db.collection("user").findOne({ _id: ObjectId(id) });

    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  } else {
    return {
      props: {
        user: JSON.parse(null),
      },
    };
  }
}

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
  button: {
    height: 40,
  },
  formControl: {
    marginTop: 27,
    minWidth: 100,
  },
};

const useStyles2 = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: 400,
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxHeight: 500,
    overflow: "auto",
  },
  paper2: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxHeight: 500,
    overflow: "auto",
  },
}));

function CreateUser({ user: users }) {

  const [username, setUsername] = useState();
  const [passwordUser, setPasswordUser] = useState();
  const [loginStatus, setLoginStatus] = useState(false);
  const [id, setId] = useState("")
  const [status, setStatus] = useState("");

  const [usernameError, setUsernameError] = useState(false);
  const [passwordUserError, setPasswordError] = useState(false);
  const [statusError, setStatusError] = useState(false)

  const [id_error, setId_error] = useState(false)
  const [id_duplicate, setId_duplicate] = useState(false)

  const [new_passwordUser, setNew_PasswordUser] = useState();

  const router = useRouter();

  const [modalStyle] = React.useState(getModalStyle);

  const [open, setOpen] = React.useState(false);
  const [open_new, setOpen_new] = React.useState(false);
  const [loading, setLoading] = useState(false)
  const [loading_update, setLoading_update] = useState(false)

  const [registerComplete, setRegisterComplete] = useState(false)

  const [edit_password, setEdit_password] = useState(false)

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen_pass = () => {
    setOpen_new(true);
  };

  const handleClose_pass = () => {
    setOpen_new(false);
  };

  const handleClose_id_duplicate = () => {
    setId_duplicate(false);
  };

  useEffect(() => {
    if (users !== null) {
      setUsername(users.username);
      setId(users.id)
      setPasswordUser(users.password);
      setLoginStatus(users.loginStatus);
      setStatus(users.status)
    } 
  }, []);

  const handleChangePass = (e) => {
    setNew_PasswordUser(e.target.value);
  };

  const handleChange_password = () => {
    setPasswordUser(new_passwordUser);
    setOpen(false);
    setOpen_new(false);
    // console.log(passwordUser);
  };

  const handleChangeStatus = (event) => {
    // console.log(company)
    setStatus(event.target.value);
    setStatusError(false)
  };

  const useStyles = makeStyles(styles);

  const handleSetState = (event) => {
    if (event.target.id === "username") {
      setUsernameError(false)
      setUsername(event.target.value);
    } else if (event.target.id === "password") {
      setPasswordError(false)
      setPasswordUser(event.target.value);
    } else if (event.target.id === "id") {
      if(!isNaN(event.target.value) && event.target.value.length === 10){
        setId(event.target.value);
        setId_error(false)
      }else if(event.target.value.includes('@') && event.target.value.includes('.com')){
        setId(event.target.value);
        setId_error(false)
      }else{
        setId_error(true)
      }
    } 
  };

  const info = {
    username: username,
    id: id,
    password: passwordUser,
    loginStatus: loginStatus,
    status: status
  };

  async function error_detect(){
    let error = []
    if(!username || usernameError){
      error.push("error")
      setUsernameError(true)
    }

    if(!passwordUser || passwordUserError){
      error.push("error")
      setPasswordError(true)
    }

    if(!status || statusError){
      error.push("error")
      setStatusError(true)
    }

    if(!id || id_error){
      error.push("error")
      setId_error(true)
    }

    // users.map(user => {
    if(users === null){
      let allUsers = await fetch("/api/user", {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
      }).then((response) => response.json());
  
      allUsers.map(user => {
        if(user.id === id){
          error.push("error")
          setId_duplicate(true)
          setId_error(true)
        }
      })
    }else{
      let allUsers = await fetch("/api/user", {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
      }).then((response) => response.json());
  
      allUsers.map(user => {
        if(user.id === id && user._id !== users._id){
          error.push("error")
          setId_duplicate(true)
          setId_error(true)
        }
      })
    }

    // })
    
    if(error[0] !== undefined){
      console.log(error[0])
      return true
    } 
    return false
  }


  const onSubmit = async (str) => {
    if(await error_detect() === true){
      
      // console.log("yes")
    }else{
      if (str === "add") {
        setLoading(true)
  
        await fetch("/api/user", {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(info), // body data type must match "Content-Type" header
        })
          .then(function(response){
            setRegisterComplete(true)
            router.push("/users")
          })  
  
      } else if (str === "update") {

        setLoading_update(true)
  
        info["_id"] = users._id;
  
        // console.log(id)
        await fetch("/api/user", {
          method: "PUT", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(info), // body data type must match "Content-Type" header
        })
        .then(function(response){
          setRegisterComplete(true)
          router.push("/users")
        }) 
      }

    }

  };

  const classes = useStyles();
  const classes2 = useStyles2();

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              {users === null ? (
                <h4 className={classes.cardTitleWhite}>ลงทะเบียน</h4>
              ) : (
                <h4 className={classes.cardTitleWhite}>อัพเดทข้อมูล</h4>
              )}
              <p className={classes.cardCategoryWhite}>
                กรุณากรอกข้อมูลด้านล่าง
              </p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="ชื่อผู้ใช้"
                    id="username"
                    formControlProps={{
                      fullWidth: true,
                      required: true,
                      error: usernameError,
                    }}
                    inputProps={{
                      defaultValue: users !== null ? users.username : null,
                      // onChange: handleChange,
                      onBlur: handleSetState,
                    }}
                  />
                </GridItem>

                <FormControl className={classes.formControl} >
                <InputLabel id="demo-simple-select-outlined-label1">
                  Status
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label1"
                  id="demo-simple-select-outlined"
                  value={status ? status : ""}
                  onChange={handleChangeStatus}
                  label="Status"
                  error={statusError}
                >
                  <MenuItem key="admin" value="admin">
                    แอดมิน
                  </MenuItem>
                  <MenuItem
                    key="normal"
                    value="normal"
                  >
                    ธรรมดา
                  </MenuItem>
                </Select>
              </FormControl>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                  <CustomInput
                    labelText="เบอร์โทรศัพท์หรืออีเมล"
                    id="id"
                    formControlProps={{
                      fullWidth: true,
                      required: true,
                      error: id_error,
                    }}
                    inputProps={{
                      defaultValue: users !== null ? users.id : null,
                      // value: passwordUser,
                      onBlur: handleSetState,
                    }}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={3}>
                  <CustomInput
                    labelText="รหัสผ่าน"
                    id="password"
                    formControlProps={{
                      fullWidth: true,
                      error: passwordUserError
                    }}
                    inputProps={{
                      // onChange: handleChange,
                      disabled: edit_password ? false : true,
                      defaultValue: users !== null ? users.password : null,
                      // value: passwordUser,
                      onBlur: handleSetState,
                    }}
                  />
                </GridItem>
                {users !== null ? (
                  <div>
                    <Button
                      className={classes.button}
                      style={{ marginTop: 30 }}
                      onClick={handleOpen}
                    >
                      แก้รหัส
                    </Button>
                    <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="simple-modal-title"
                      aria-describedby="simple-modal-description"
                    >
                      <div style={modalStyle} className={classes2.paper}>
                        <p>ท่านต้องการแก้ไขรหัสผ่านใช่หรือไม่</p>
                        <Button variant="contained" color="primary" className={classes.button} onClick={() => {setEdit_password(true) 
                                                                                                                handleClose()}}>
                          ใช่
                        </Button>
                        <Button variant="contained" color="secondary" className={classes.button} onClick={() => handleClose()}>
                          ไม่ใช่
                        </Button>
                      </div>
                    </Modal>
                  </div>
                ) : null}
              </GridContainer>

              <br />
            </CardBody>
            <CardFooter>
              <div>
                {users === null ? (
                  <Button onClick={() => onSubmit("add")} color="primary">
                    ลงทะเบียน
                  </Button>
                ) : (
                  <Button onClick={() => onSubmit("update")} color="primary">
                    อัพเดท
                  </Button>
                )}
                <Button onClick={() => router.push("/users")} color="rose">
                  ยกเลิก
                </Button>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>

      <Modal
        open={loading}
        onClose={handleClose_pass}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div
          style={modalStyle}
          className={classes2.paper2}
        >
          {registerComplete ? <h2 style={{alignContent: "center"}}>ลงทะเบียนสำเร็จ</h2> :
              loading ? <h2 style={{alignContent: "center"}}>Loading</h2> : null
          }
          
        </div>
      </Modal>

      <Modal
        open={loading_update}
        onClose={handleClose_pass}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div
          style={modalStyle}
          className={classes2.paper2}
        >
          {registerComplete ? <h2 style={{alignContent: "center"}}>อัพเดทสำเร็จ</h2> :
              loading_update ? <h2 style={{alignContent: "center"}}>Loading</h2> : null
          }
          
        </div>
      </Modal>

      <Modal
        open={id_duplicate}
        onClose={handleClose_id_duplicate}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div
          style={modalStyle}
          className={classes2.paper2}
        >
          <h2>ขออภัย เบอร์โทรศัพท์หรืออีเมลนี้ถูกใช้แล้ว</h2>
          
        </div>
      </Modal>

    </div>
  );
}

export default CreateUser;
