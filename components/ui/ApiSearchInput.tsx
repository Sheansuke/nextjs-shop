import { SearchOutlined } from "@mui/icons-material";
import { ListItem, Input, InputAdornment, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { FC, useState } from "react";

interface ApiSearchInputProps {
    onSearch?: () => void;
}

export const ApiSearchInput: FC<ApiSearchInputProps> = ({ onSearch }) => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState<string>("");

    const handleSearchTermChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchTerm = () => {
        if (searchTerm.trim().length === 0) return;
        router.push(`/search/${searchTerm}`);
        onSearch && onSearch();
    };
    return (
        <ListItem>
            <Input
                value={searchTerm}
                onChange={handleSearchTermChange}
                onKeyPress={(event) => {
                    if (event.key === "Enter") {
                        handleSearchTerm()
                    }
                }}
                type="text"
                placeholder="Buscar..."
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton onClick={handleSearchTerm}>
                            <SearchOutlined />
                        </IconButton>
                    </InputAdornment>
                }
            />
        </ListItem>
    );
};
