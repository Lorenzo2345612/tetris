export enum DireccionRotacion {
    Horario,
    Antihorario,
}

export function rotarMatriz(matriz: number[][], direccion: DireccionRotacion): number[][] {
    const filas = matriz.length;
    const columnas = matriz[0].length;

    const matrizRotada: number[][] = new Array(columnas).fill(null).map(() => new Array(filas).fill(0));

    if (direccion === DireccionRotacion.Antihorario) {
        for (let i = 0; i < filas; i++) {
            for (let j = 0; j < columnas; j++) {
                matrizRotada[j][filas - 1 - i] = matriz[i][j];
            }
        }
    } else if (direccion === DireccionRotacion.Horario) {
        for (let i = 0; i < filas; i++) {
            for (let j = 0; j < columnas; j++) {
                matrizRotada[columnas - 1 - j][i] = matriz[i][j];
            }
        }
    } else {
        throw new Error('Invalid Direction');
    }

    return matrizRotada;
}