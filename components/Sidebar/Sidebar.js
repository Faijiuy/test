/*eslint-disable*/
import classNames from "classnames";
import PropTypes from "prop-types";
import Link from "next/link";
import { useRouter } from "next/router";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
// core components
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks.js";
import RTLNavbarLinks from "components/Navbars/RTLNavbarLinks.js";

import styles from "assets/jss/nextjs-material-dashboard/components/sidebarStyle.js";


import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ListItemIcon from '@material-ui/core/ListItemIcon';



import IconExpandLess from '@material-ui/icons/ExpandLess'
import IconExpandMore from '@material-ui/icons/ExpandMore'

import React, { useState, useEffect, useContext } from "react";



export default function Sidebar(props) {
  // collapse
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  // used for checking current route
  const router = useRouter();
  // creates styles for this component
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    return router.route.indexOf(routeName) > -1 ? true : false;
  }
  const { color, logo, image, logoText, routes } = props;

  var activeItems = (path) => {
    if(router.route !== path) return false
    return true 
  }

  var links = (
    <List className={classes.list}>
      {routes.map((prop, key) => {
        var activePro = " ";
        var listItemClasses;
        
        listItemClasses = classNames({
          // [" " + classes[color]]: activeRoute(prop.layout + prop.path),

          [" " + classes[color]]: activeItems(prop.path),

        });
        
        const whiteFontClasses = classNames({
          [" " + classes.whiteFont]:
            // activeRoute(prop.layout + prop.path) ||
            activeRoute(prop.path) ||
            prop.path === "/upgrade-to-pro",
        });
        return (
          //orginal
          // <Link href={prop.layout + prop.path} key={key}> 
          <div key={key}>
            {prop.path === "/couponMgt" ? (
              <div>
              <ListItem button className={classes.itemLink } onClick={handleClick}>
              {typeof prop.icon === "string" ? (
                      <Icon
                        className={classNames(classes.itemIcon, whiteFontClasses, {
                          [classes.itemIconRTL]: props.rtlActive,
                        })}
                      >
                        {prop.icon}
                      </Icon>
                    ) : (
                      <prop.icon
                        className={classNames(classes.itemIcon, whiteFontClasses, {
                          [classes.itemIconRTL]: props.rtlActive,
                        })}
                      />
                    )}
                  {open ? <ExpandLess 
                  className={classNames(classes.itemIcon2, whiteFontClasses, {
                            [classes.itemIconRTL]: props.rtlActive,
                          })} 
                          /> : 
                          <ExpandMore className={classNames(classes.itemIcon2, whiteFontClasses, {
                            [classes.itemIconRTL]: props.rtlActive,
                          })} />}
                <ListItemText primary="คูปอง" className={classNames(classes.itemText, whiteFontClasses, {
                        [classes.itemTextRTL]: props.rtlActive,
                      })}
                      disableTypography={true} />
                        {/* {open ? <ExpandLess /> : <ExpandMore />} */}
              </ListItem>
              <Collapse in={open} timeout="auto" unmountOnExit>
                {prop.pathArr.map((obj, key) => {
                  return (
                    <a className={activePro + classes.item}>

                  <Link href={obj.path} key={key}>
                    {/* <List component="div" disablePadding>
                      <ListItem button className={classes.itemLink2 + listItemClasses}>
                        
                        <ListItemText primary="ซื้อคูปอง" className={classNames(classes.itemText, whiteFontClasses, {
                            [classes.itemTextRTL]: props.rtlActive,
                          })}
                          disableTypography={true} />
                      </ListItem>
                    </List> */}

                    {/* <a className={activePro + classes.item} disablePadding> */}
                    <List component="div" disablePadding>
                      <ListItem button  className={`${classes.itemLink2} ${router.route === obj.path ? classes[color] : ''}`} >
                        
                        <ListItemText
                          primary={obj.name}
                          className={classNames(classes.itemText, whiteFontClasses, {
                            [classes.itemTextRTL]: props.rtlActive,
                          })}
                          disableTypography={true}
                        />
                      </ListItem>
                      </List>
                    {/* </a> */}
                  </Link>
                  </a>)

                })}
                
              </Collapse>

              </div>
            ) : (
              <Link href={prop.path} key={key}> 
              
                <a className={activePro + classes.item}>
                  <ListItem button className={classes.itemLink + listItemClasses}>
                    {typeof prop.icon === "string" ? (
                      <Icon
                        className={classNames(classes.itemIcon, whiteFontClasses, {
                          [classes.itemIconRTL]: props.rtlActive,
                        })}
                      >
                        {prop.icon}
                      </Icon>
                    ) : (
                      <prop.icon
                        className={classNames(classes.itemIcon, whiteFontClasses, {
                          [classes.itemIconRTL]: props.rtlActive,
                        })}
                      />
                    )}
                    <ListItemText
                      primary={props.rtlActive ? prop.rtlName : prop.name}
                      className={classNames(classes.itemText, whiteFontClasses, {
                        [classes.itemTextRTL]: props.rtlActive,
                      })}
                      disableTypography={true}
                    />
                  </ListItem>
                </a>
              </Link>

            )}

          </div>
          

        );
      })}
    </List>
  );
  var brand = (
    <div className={classes.logo}>
      <a
        href="/dashboard"
        className={classNames(classes.logoLink, {
          [classes.logoLinkRTL]: props.rtlActive,
        })}
        target="_blank"
      >
        <div className={classes.logoImage}>
          <img src={logo} alt="logo" className={classes.img} />
        </div>
        {logoText}
      </a>
    </div>
  );
  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={props.rtlActive ? "left" : "right"}
          open={props.open}
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive,
            }),
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            {props.rtlActive ? <RTLNavbarLinks /> : <AdminNavbarLinks />}
            {links}
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          anchor={props.rtlActive ? "right" : "left"}
          variant="permanent"
          open
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive,
            }),
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>{links}</div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
    </div>
  );
}

Sidebar.propTypes = {
  rtlActive: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  bgColor: PropTypes.oneOf([
    "white",
    "purple",
    "blue",
    "green",
    "orange",
    "red",
  ]),
  logo: PropTypes.string,
  image: PropTypes.string,
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool,
};