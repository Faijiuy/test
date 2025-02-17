import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import React, { useState, useEffect, useContext } from "react";
import Choose_Company from "../../components/LITTLE_TANK_COMPONENTS/COUPON_MGT/choose_company";
import Buy_Coupons from "../../components/LITTLE_TANK_COMPONENTS/COUPON_MGT/buy_coupons";
import Confirm from "../../components/LITTLE_TANK_COMPONENTS/COUPON_MGT/confirm";
import Modal from '@material-ui/core/Modal';

import { connectToDatabase } from "../../util/mongodb";
import { useRouter } from "next/router";

import { format } from "date-fns";
import AuthContext from "../../stores/authContext";


export async function getServerSideProps() {
  const { db } = await connectToDatabase();

  const customers = await db.collection("customer").find().sort({}).toArray();

  const coupons = await db.collection("coupons").find().sort({}).toArray();

  return {
    props: {
      customer: JSON.parse(JSON.stringify(customers)),
      coupon: JSON.parse(JSON.stringify(coupons)),
    },
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  root_stepper: {
    width: "100%",
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  button_add: {
    // marginRight: theme.spacing(1),
    marginLeft: theme.spacing(10),
  },
  button_text_rows: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
  table: {
    maxWidth: 500,
  },
  select: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const boxStyle = {
  padding: 30,
  margin: "50px",
};

function getModalStyle() {
  const top = 50 ;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

// Stepper
function getSteps() {
  return ["เลือกบริษัท", "ซื้อคูปอง", "ยืนยัน"];
}

function checkText_Rows(text_rows) {
  if(text_rows[0] === undefined) return true
  if(Object.keys(groupByKey(text_rows, "price")).length !== text_rows.length) return true
  return text_rows.some(
    (row) =>
      Number(row.price) < 500 ||
      !row.price ||
      !row.qty ||
      (Number(row.price) % 100 !== 0 && Number(row.price) % 100 !== 50) ||
      Number(row.qty) === 0
  );
}

function groupByKey(array, key) {
  return array.reduce((hash, obj) => {
    if (obj[key] === undefined) return hash;
    return Object.assign(hash, {
      [obj[key]]: (hash[obj[key]] || []).concat(obj),
    });
  }, {});
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return <Choose_Company />;
    case 1:
      return <Buy_Coupons />;
    case 2:
      return <Confirm />;
    default:
      return "Unknown step";
  }
}

async function toSubmit(user_id, date, company, ordered_company, array){
  if (Object.keys(ordered_company).includes(array.price.toString())) {
    let runNo = ordered_company[array.price.toString()].length;

    for (let i = 1; i <= Number(array.qty); i++) {
      const promise_fetch = await new Promise(async (resolve) => {
        fetch("/api/coupon", {
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
          body: JSON.stringify({
            code:
              company._id +
              "-" +
              date +
              "-" +
              array.price +
              "-" +
              (runNo + i),
            companyRef: company._id,
            generatedDate: date,
            amount: Number(array.price),
            runningNo: runNo + i,
            used: false,
            usedDateTime: "",
            recordedBy: "",
            printed: false,
            generatedBy: user_id
          }), // body data type must match "Content-Type" header
        }).then(function(response){
          resolve(response)

        })
      })   
      Promise.all([promise_fetch]).then(value => {
        console.log(i, value)
        
      })
    }
  } else {
    for (let i = 1; i <= Number(array.qty); i++) {
      const promise_fetch = await new Promise(async (resolve) => {
        fetch("/api/coupon", {
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
          body: JSON.stringify({
            code: company._id + "-" + date + "-" + array.price + "-" + i,
            companyRef: company._id,
            generatedDate: date,
            amount: Number(array.price),
            runningNo: i,
            used: false,
            usedDateTime: "",
            recordedBy: "",
            printed: false,
            generatedBy: user_id
  
          }), // body data type must match "Content-Type" header
        }).then(function(response){
          resolve(response)
        })

      })
      Promise.all([promise_fetch]).then(value => {
        console.log(i, value)
        
      })
    }
  }
  return "done"
}

const StepperContext = React.createContext();

function PurchaseCoupon({ customer: customers, coupon: coupons }) {

  const [modalStyle] = React.useState(getModalStyle);

  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const [company, setCompany] = useState("");
  const [rows, setRows] = useState([]);
  const [tableState, setTableState] = useState(false);

  const [open, setOpen] = useState(false);

  const [total_table, setTotal_table] = useState();
  const [total_coupons, setTotal_coupons] = useState();
  const [text_rows, setText_rows] = useState([{ price: null, qty: null, total: null },]);
  const [date, setDate] = useState();
  const router = useRouter();

  const [complete, setComplete] = useState(false)



  const [ordered_company, setOrdered_company] = useState([]);

  const { user_id } = useContext(AuthContext)
  console.log("user_id: ", user_id)

  const body = (
    <div style={modalStyle} className={classes.paper}>
      {complete ? 
      <div>
        <p>ระบบทำการสร้างคูปองเรียบร้อยแล้ว สามารถไปที่หน้าปริ้นท์คูปองเพื่อทำการพิมพ์</p>
        <Button variant="contained" color="primary" href="/coupon/printPage" className={classes.button}>
          ปริ้นคูปอง
        </Button>
        <Button variant="contained" color="secondary" className={classes.button} onClick={() => handleClose()}>
          ปิด
        </Button>
      </div> : 
      <p>
        ระบบกำลังทำการสร้างคูปอง กรุณารอสักครู่
      </p>}    
    </div>
  );


  

  useEffect(() => {
    let filterCoupon = coupons.filter(
      (coupon) =>
        coupon.companyRef === company._id && coupon.generatedDate === date
    );

    let groupArray = groupByKey(filterCoupon, "amount");

    setOrdered_company(groupArray);
  }, [company]);

  const handleNext = () => {
    if (activeStep == 2) {
      setOpen(true)

      async function submit_one_per_couponType(array){
        for(let i = 0; i < array.length; i++){
          const text_rows_promise = await new Promise(async (resolve) => { 
            toSubmit(user_id, date, company, ordered_company, array[i])
            .then(function(response){
              console.log(response)
              resolve(response)
            })
          })
  
          Promise.all([text_rows_promise]).then(value => {
            console.log("this is value: ", i, value)
           
          })
        }
        setComplete(true)
      }

      submit_one_per_couponType(text_rows)

    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleClose = () => {
    setOpen(false);
    setComplete(false)
  };

  useEffect(() => {
    let todayDate = format(new Date(), "dd/MM/yyyy");

    if (new Date().getFullYear() >= 2564) {
      let thaiDate = format(new Date(), "dd/MM");
      setDate(thaiDate + "/" + (new Date().getFullYear() - 543));
    } else {
      setDate(todayDate);
    }
  }, []);

  return (
    <div style={boxStyle}>
      <StepperContext.Provider
        value={{
          company,
          setCompany,
          customers,
          coupons,
          tableState,
          setTableState,
          classes,
          rows,
          setRows,
          total_table,
          setTotal_table,
          total_coupons,
          setTotal_coupons,
          text_rows,
          setText_rows,
          ordered_company,
          setOrdered_company,
          date,
          setDate,
        }}
      >
        <Grid container>
          <div className={classes.root_stepper}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    <Typography>{getStepContent(index)}</Typography>
                    {/* {company.company} */}
                    <div className={classes.actionsContainer}>
                      <div>
                        <Button
                          disabled={activeStep === 0}
                          onClick={handleBack}
                          className={classes.button}
                        >
                          กลับ
                        </Button>
                        {activeStep === steps.length - 1 ? (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            className={classes.button}
                          >
                            ยืนยัน
                          </Button>
                        ) : activeStep == 0 ? (
                          <Button
                            disabled={!company}
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            className={classes.button}
                          >
                            ต่อไป
                          </Button>
                        ) : activeStep == 1 ? (
                          <Button
                            disabled={checkText_Rows(text_rows)}
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            className={classes.button}
                          >
                            ต่อไป
                          </Button>
                        ) : activeStep == 2 ? (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            className={classes.button}
                          >
                            ยืนยัน
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length && (
              <Paper square elevation={0} className={classes.resetContainer}>
                <Typography>
                  คุณได้ทำการซื้อคูปองเรียบร้อยแล้ว
                </Typography>
                <Button
                  onClick={() => router.reload()}
                  className={classes.button}
                >
                  ซื้อเพิ่ม
                </Button>
                <Button variant="contained" color="primary" href="/coupon/printPage" className={classes.button}>
                  ปริ้นคูปอง
                </Button>
              </Paper>
            )}
          </div>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {body}
        </Modal>
          
        </Grid>
      </StepperContext.Provider>
    </div>
  );
}

export { StepperContext };

export default PurchaseCoupon;
