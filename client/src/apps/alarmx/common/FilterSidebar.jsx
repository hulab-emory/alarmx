import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Chip from "@mui/material/Chip";
import Badge from "@mui/material/Badge";
import TextField from "@mui/material/TextField";
import { createTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";
import Scrollbar from "./ScrollBar";

const theme = createTheme();

// ----------------------------------------------------------------------

FilterSidebar.propTypes = {
  openFilter: PropTypes.bool,
  onCloseFilter: PropTypes.func,
  OPTIONS: PropTypes.object,
  checkedFilter: PropTypes.object,
  setCheckedFilter: PropTypes.func,
  activeFiltersCount: PropTypes.number,
};

export default function FilterSidebar({
  openFilter,
  onCloseFilter,
  OPTIONS,
  checkedFilter,
  onChangeCheckbox, 
  activeFiltersCount
}) {

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(OPTIONS);


  useEffect(() => {
    if (searchTerm === "") {
      setFilteredOptions(OPTIONS);
    } else {
      const filtered = Object.keys(OPTIONS).reduce((acc, key) => {
        const filteredItems = OPTIONS[key].filter(item =>
          item.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filteredItems.length > 0) {
          acc[key] = filteredItems;
        }
        return acc;
      }, {});
      setFilteredOptions(filtered);
    }
  }, [searchTerm]);
  
  return (
    <>
      <Drawer
        anchor="right"
        open={openFilter}
        onClose={onCloseFilter}
        PaperProps={{
          sx: {
            width: 280,
            border: "none",
            overflow: "hidden",
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          sx={{ px: 1, py: 2 }}
        >
           <Typography variant="subtitle1" sx={{mx:1}}>Filters</Typography>
           <Chip label={activeFiltersCount} />
        </Stack>

        <Divider />

        <TextField
          fullWidth
          placeholder="Type to search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mx: 1, width: 260, mt: 2, mb: 2 }}
        />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            {Object.keys(filteredOptions).map((category) => (
              <div key={category}>
                <Typography variant="subtitle1" gutterBottom>
                  {category}
                </Typography>
                <FormGroup>
                  {filteredOptions[category].map((item) => (
                    <FormControlLabel
                      key={item}
                      control={
                        <Checkbox
                          checked={checkedFilter[category]?.[item] ?? false}
                          onChange={() => onChangeCheckbox(category, item)}
                        />
                      }
                      label={item}
                    />
                  ))}
                </FormGroup>
              </div>
            ))}
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
          >
            Clear All
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
