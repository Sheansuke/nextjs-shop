import { PeopleOutline } from "@mui/icons-material";
import { Grid, MenuItem, Select, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { NextPage } from "next";
import React from "react";
import { AdminLayout } from "../../components/layouts/AdminLayout";
import useSWR from "swr";
import { IUser } from "../../interfaces/IUser";
import { tesloApi } from "../../api";

const UsersPage: NextPage = () => {
    const { data, error, mutate } = useSWR<IUser[]>("/api/admin/users");

    if (!error && !data) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        console.log("🚀 ~ file: users.tsx ~ line 20 ~ error", error);
        return <Typography>Error al cargar los datos</Typography>;
    }


    const onRoleUpdate = async (userId: string, newRole: string) => {
        try {
            await tesloApi.put("/admin/users", { userId, role: newRole });
            mutate(data!.map(u => u._id === userId ? { ...u, role: newRole } : u));

        } catch (error) {
            console.log("🚀 ~ file: users.tsx ~ line 32 ~ error", error);
        }


    }


    const columns: GridColDef[] = [
        { field: "email", headerName: "Email", width: 250 },
        { field: "name", headerName: "Nombre", width: 250 },
        {
            field: "role",
            headerName: "Rol",
            width: 250,
            renderCell: ({ row }: GridValueGetterParams) => {
                return (
                    <Select
                        value={row?.role}
                        label="Rol"
                        sx={{
                            width: 300,
                        }}
                        onChange={(e) => {
                            onRoleUpdate(row.id, e.target.value);
                        }}
                    >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="client">Cliente</MenuItem>
                        <MenuItem value="super-user">super-user</MenuItem>
                        <MenuItem value="SEO">SEO</MenuItem>
                    </Select>
                );
            },
        },
    ];
    const rows = data!.map((user: IUser, index: number) => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
    }));
    return (
        <AdminLayout
            title="Usuarios"
            subtitle="Listado de usuarios"
            icon={<PeopleOutline />}
        >
            <Grid container>
                <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
                    <DataGrid
                        columns={columns}
                        rows={rows}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />
                </Grid>
            </Grid>
        </AdminLayout>
    );
};

export default UsersPage;
