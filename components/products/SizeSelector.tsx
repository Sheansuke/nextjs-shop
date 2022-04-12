import { Box, Button } from "@mui/material";
import { FC, MouseEventHandler } from "react";
import { SizesType, TypesType } from "../../interfaces/IProduct";

interface ISizeSelectorProps {
    selectedSize?: SizesType;
    sizes: SizesType[];
    onSelectSize: (size: SizesType) => void;
}

export const SizeSelector: FC<ISizeSelectorProps> = ({
    selectedSize,
    sizes,
    onSelectSize,
}) => {
    return (
        <Box>
            {sizes.map((size) => (
                <Button
                    key={size}
                    onClick={() => onSelectSize(size)}
                    size="small"
                    color={selectedSize === size ? "primary" : "info"}
                >
                    {size}
                </Button>
            ))}
        </Box>
    );
};
