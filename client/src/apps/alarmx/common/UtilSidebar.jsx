import PropTypes from "prop-types";
import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Scrollbar from "./ScrollBar";

export const UtilSidebar = ({ header, footer, data, openFilter, onCloseFilter, handleCheckedItem }) => {
  // Track checked state dynamically
  const [checkedItems, setCheckedItems] = useState(new Set(data));

  const handleCheckboxChange = (item) => {
    setCheckedItems((prev) => {
      const newChecked = new Set(prev);
      if (newChecked.has(item)) {
        newChecked.delete(item);
      } else {
        newChecked.add(item);
      }
      handleCheckedItem(item, newChecked.has(item)); // Pass item and checked state
      return newChecked;
    });
  };

  return (
    <Drawer
      anchor="right"
      open={openFilter}
      onClose={onCloseFilter}
      PaperProps={{
        sx: { minWidth: 280, border: "none", overflow: "hidden", backgroundColor: "#fff" },
      }}
    >
      <Stack direction="row" alignItems="center" sx={{ px: 2, py: 2 }}>
        <Typography variant="subtitle1">{header}</Typography>
      </Stack>

      <Divider />

      <Scrollbar>
        <Box sx={{ px: 1 }}>
          {data.map((item, index) => (
            <Stack direction="row" alignItems="center" key={`${item}-${index}`} >
              <Checkbox
                size="small" 
                checked={checkedItems.has(item)} 
                onChange={() => handleCheckboxChange(item)} 
              />
              <Typography variant="body2" sx={{fontSize: 12}}>{item}</Typography>
            </Stack>
          ))}
        </Box>
      </Scrollbar>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ p: 3 }}>
        <Button fullWidth size="large" variant="outlined">
          {footer}
        </Button>
      </Box>
    </Drawer>
  );
};

UtilSidebar.propTypes = {
  header: PropTypes.string.isRequired,
  footer: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  openFilter: PropTypes.bool.isRequired,
  onCloseFilter: PropTypes.func.isRequired,
  handleCheckedItem: PropTypes.func.isRequired,
};
