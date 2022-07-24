const express = require('express');
const oracledb = require('oracledb');
const app = express();

// Para poder recibir datos
app.use(express.json());

/**
 * Funcion que trae todos los registros de empleados de la base de datos
 * @param {*} req
 * @param {*} res
 */
const getEmpleados = async (req, res) => {
    try {
        conn = await oracledb.getConnection({
            user: 'jodramirezm',
            password: 'jodramirezm',
            connectionString: 'localhost',
        });
        result = await conn.execute(`SELECT * FROM empleado`, [], {
            resultSet: true,
            outFormat: oracledb.OUT_FORMAT_OBJECT,
        });
        const rs = result.resultSet;
        let rows;
        do {
            rows = await rs.getRows(100);
            console.log(rows.length);
            console.log(rows);
        } while (rows.length === 100);
        res.send(rows);
        await rs.close();
    } catch (error) {
        console.log(error);
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (error) {
                console.error(error);
            }
        }
    }
};

/**
 * Funcion que trae un registro basado en el id
 * @param {*} req
 * @param {*} res
 */
const getPorId = async (req, res) => {
    try {
        const id = req.params.id;
        conn = await oracledb.getConnection({
            user: 'jodramirezm',
            password: 'jodramirezm',
            connectionString: 'localhost',
        });
        result = await conn.execute(
            `SELECT * FROM empleado WHERE ID = :id`,
            [id],
            {
                resultSet: true,
                outFormat: oracledb.OUT_FORMAT_OBJECT,
            }
        );
        const rs = result.resultSet;
        let rows;
        do {
            rows = await rs.getRows(100);
            console.log(rows.length);
            console.log(rows);
        } while (rows.length === 100);
        res.send(rows);
        await rs.close();
    } catch (error) {
        console.log(error);
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (error) {
                console.error(error);
            }
        }
    }
};

/**
 * Funcion que actualiza el empleado con la informacion que se pasa en la peticion
 * @param {*} req
 * @param {*} res
 */
const actualizarEmpleado = async (req, res) => {
    try {
        const body = req.body;
        console.log(req.body);

        const data = {
            ID: body.ID,
            nombres: body.nombres,
            apellidos: body.apellidos,
            fecha_contratacion: body.fecha_contratacion,
            cargo: body.cargo,
            salario: body.salario,
            documento: body.documento,
        };

        // conectar al DBMS
        conn = await oracledb.getConnection({
            user: 'jodramirezm',
            password: 'jodramirezm',
            connectionString: 'localhost',
        });
        //Consulta UPDATE
        result = await conn.execute(
            `UPDATE empleado
             SET nombres= :nombres,
                 apellidos= :apellidos,
                 fecha_contratacion= TO_DATE(:fecha_contratacion, 'yyyy-mm-dd'),
                 cargo= :cargo,
                 salario= :salario,
                 documento= :documento
             WHERE ID = :id`,
            {
                nombres: data.nombres,
                apellidos: data.apellidos,
                fecha_contratacion: data.fecha_contratacion,
                cargo: data.cargo,
                salario: parseInt(data.salario),
                documento: data.documento,
                id: parseInt(data.ID),
            }
        );
        console.log(result);
        conn.commit();
        res.json(data);
    } catch (error) {
        console.log(error);
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (error) {
                console.error(error);
            }
        }
    }
};

/**
 * Funcion que crea el empleado en la base de datos
 * @param {*} req
 * @param {*} res
 */
const crearEmpleado = async (req, res) => {
    try {
        const body = req.body;
        console.log(req.body);

        const data = {
            nombres: body.nombres,
            apellidos: body.apellidos,
            fecha_contratacion: body.fecha_contratacion,
            cargo: body.cargo,
            salario: body.salario,
            documento: body.documento,
        };

        // conectar al DBMS
        conn = await oracledb.getConnection({
            user: 'jodramirezm',
            password: 'jodramirezm',
            connectionString: 'localhost',
        });
        //Consulta INSERT
        result = await conn.execute(
            `INSERT INTO empleado
                (nombres, apellidos, fecha_contratacion,
                cargo, salario, documento)
             VALUES (:nombres, :apellidos, TO_DATE(:fecha_contratacion, 'yyyy-mm-dd'),
                :cargo, :salario, :documento)`,
            {
                nombres: data.nombres,
                apellidos: data.apellidos,
                fecha_contratacion: data.fecha_contratacion,
                cargo: data.cargo,
                salario: parseInt(data.salario),
                documento: data.documento,
            }
        );
        console.log(result);
        conn.commit();
        res.json(data);
    } catch (error) {
        console.log(error);
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (error) {
                console.error(error);
            }
        }
    }
};

/* Obtener todos los empleados*/
app.get('/api/empleados', async (request, response) => {
    getEmpleados(request, response);
});

/* Obtener empleado por id */
app.get('/api/empleados/:id', async (request, response) => {
    getPorId(request, response);
});

/* Modificar empleado */
app.post('/api/empleados/modificar', (request, response) => {
    actualizarEmpleado(request, response);
});

/* Crear empleado */
app.post('/api/empleados/crear', (request, response) => {
    crearEmpleado(request, response);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
