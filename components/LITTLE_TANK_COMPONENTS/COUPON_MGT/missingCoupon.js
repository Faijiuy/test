import React, { useState, useEffect } from "react";
import Box from "@material-ui/core/Box";

import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/Grid/GridContainer.js";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "components/CustomButtons/Button.js";

import TextField from '@material-ui/core/TextField'
import Modal from '@material-ui/core/Modal';


import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";

import { format } from "date-fns";

const styles = {
  root: {
    marginLeft: "9px",
  },
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
  list: {
    width: 300,
    height: 230,
    overflow: "auto",
  },
};

const useStyles2 = makeStyles((theme) => ({
  formControl: {
    // margin: theme.spacing(1),
    marginLeft: theme.spacing(2),
    minWidth: 120,
  },
  formControl1: {
    // margin: theme.spacing(1),
    marginLeft: theme.spacing(2),
    minWidth: 120,
    marginTop: 16,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
    button: {
      marginLeft: theme.spacing(3),
    },
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


function getModalStyle() {
  const top = 50 ;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const boxStyle = {
  padding: 0,
  margin: "20px",
};

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

function MissingCoupon({ customers, coupons }) {
  const classes2 = useStyles2();

  const [checked, setChecked] = React.useState([]);
  const [right, setRight] = React.useState([]);

  const [company, setCompany] = useState("");
  const [type, setType] = useState();
  const [typeList, setTypeList] = useState([]);

  const [couponList, setCouponList] = useState([]);
  const [date, setDate] = useState();
  const [open, setOpen] = useState(false);

  const [modalStyle] = React.useState(getModalStyle);



  useEffect(() => {
    let todayDate = format(new Date(), "dd/MM/yyyy");

    if (new Date().getFullYear() >= 2564) {
      let thaiDate = format(new Date(), "dd/MM");
      setDate(thaiDate + "/" + (new Date().getFullYear() - 543));
    } else {
      setDate(todayDate);
    }
  }, []);

  useEffect(() => {
    let couponsOfCompany = coupons.filter(
      (coupon) => coupon.companyRef === company._id
    );
    let types = groupByKey(couponsOfCompany, "amount");

    setTypeList(Object.keys(types));
  }, [company]);

  useEffect(() => {
    let activeList = coupons.filter(
      (coupon) =>
        coupon.companyRef === company._id &&
        !coupon.used &&
        (date  ? coupon.generatedDate.includes(date) : true) &&
        (type ? coupon.amount === Number(type) : true)
    );
    let missingList = coupons.filter(
      (coupon) =>
        coupon.companyRef === company._id &&
        coupon.used === "missing" &&
        (date  ? coupon.generatedDate.includes(date) : true) &&
        (type ? coupon.amount === Number(type) : true)
    );

    setCouponList(activeList);
    setRight(missingList);
  }, [company, date, type]);

  function groupByKey(array, key) {
    return array.reduce((hash, obj) => {
      if (obj[key] === undefined) return hash;
      return Object.assign(hash, {
        [obj[key]]: (hash[obj[key]] || []).concat(obj),
      });
    }, {});
  }

  const handleChangeCompany = (event) => {
    setCompany(event.target.value);
  };

  const handleChangeType = (event) => {
    setType(event.target.value);
  };

  const handleOpenModal = () => {
    setOpen(true)
  };

  const handleCloseModal = () => {
    setOpen(false)
  };

  const useStyles = makeStyles(styles);
  const classes = useStyles();

  //List toggle component

  const leftChecked = intersection(checked, couponList);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setCouponList(not(couponList, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setCouponList(couponList.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title, items) => (
    <Card>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{ "aria-label": "all items selected" }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List className={classes.list} dense component="div" role="list">
        {items.map((value, index) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem
              key={index}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={`${value.generatedDate} | ราคา: ${value.amount} | ลำดับที่: ${value.runningNo}`}
              />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  
  const handleDateChange = (e) => {
    setDate(e.target.value)
  };

  const onSubmit_missing_coupon = (e) => {
    setOpen(true)

    right.map((coupon) => {
      if (coupon["used"] == false) {
        coupon["used"] = "missing";

        fetch("/api/coupon", {
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
          body: JSON.stringify(coupon), // body data type must match "Content-Type" header
        }).then((response) => response.json());
      }
    });

    couponList.map((coupon) => {
      if (coupon["used"] == "missing") {
        coupon["used"] = false;

        fetch("/api/coupon", {
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
          body: JSON.stringify(coupon), // body data type must match "Content-Type" header
        }).then((response) => response.json());
      }
    });

    
  };

  return (
    <div>
      <Box
        className="no-print"
        bgcolor="secondary.main"
        color="secondary.contrastText"
        p={2}
      >
        <h4>วิธีการใช้</h4>
        <ol>
          <li>เลือก บริษัท ราคา และวันที่ เพื่อแสดงคูปองคงเหลือ</li>
          <li>รูปแบบคูปอง {'=>'} "(วันที่ซื้อ) | (ราคา) | (ลำดับเลข)" เช่น "25/09/2021 | ราคา: 1000 | ลำดับที่: 3" หมายถึง คูปองราคา 1000 บาท ลำดับเลขที่ 3 ซื้อเมื่อ 25/09/2021</li>
          <li>คลิกเลือกลำดับคูปองที่หายไป </li>
          <li>กดปุ่ม {'>'} ที่อยู่ข้างกล่อง เพื่อย้ายคูปองไปสู่กล่อง "คูปองสูญหาย"</li>
          <li>เมื่อเลือกเสร็จหมดแล้ว กดปุ่ม "ยืนยัน" ด้านล่าง</li>
        </ol> 
        
      </Box>

      <div style={boxStyle}>
        <GridContainer>
          <FormControl className={classes2.formControl1}>
            <InputLabel id="demo-simple-select-outlined-label">
              ชื่อลูกค้า
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={company ? company : ""}
              onChange={handleChangeCompany}
              label="Company"
            >
              {customers.map((company) => {
                return (
                  <MenuItem key={company.company} value={company}>
                    {company.company}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl className={classes2.formControl1}>
            <InputLabel id="demo-simple-select-outlined-label">ราคา</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={type ? type : ""}
              onChange={handleChangeType}
              label="Company"
            >
              {typeList.map((type) => {
                return (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl className={classes2.formControl1}>
            <TextField label="วัน/เดือน/ปีที่ผลิต" value={date} onChange={(e) => handleDateChange(e)}/>

          </FormControl>

          <div style={{marginTop: "10px"}}>
            <Grid
              container
              spacing={2}
              justifyContent="left"
              alignItems="center"
              className={classes.root}
            >
              <Grid item>{customList("คูปองคงเหลือ", couponList)}</Grid>
              <Grid item>
                <Grid container direction="column" alignItems="center">
                  <Button
                    variant="outlined"
                    size="small"
                    className={classes.button}
                    onClick={handleCheckedRight}
                    disabled={leftChecked.length === 0}
                    aria-label="move selected right"
                  >
                    &gt;
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    className={classes.button}
                    onClick={handleCheckedLeft}
                    disabled={rightChecked.length === 0}
                    aria-label="move selected left"
                  >
                    &lt;
                  </Button>
                </Grid>
              </Grid>
              <Grid item>{customList("คูปองสูญหาย", right)}</Grid>
            </Grid>
          </div>
        </GridContainer>
        <br />

        <Button
          className={classes2.button}
          onClick={() => onSubmit_missing_coupon()}
          color="primary"
        >
          ยืนยัน
        </Button>

        <Modal
          open={open}
          onClose={handleCloseModal}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div style={modalStyle} className={classes2.paper}>
            <h2>ย้ายสำเร็จ</h2>

            <Button
              className={classes2.button}
              onClick={() => handleCloseModal()}
              color="primary"
            >
              ยืนยัน
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default MissingCoupon;
