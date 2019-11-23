CREATE DATABASE sistema_gerenciamento_agil;

USE sistema_gerenciamento_agil;

CREATE TABLE task(
	id_task INT NOT NULL,
    descricao VARCHAR(250),
    prazo DATE,
    PRIMARY KEY(id_task)
);

CREATE TABLE programador(
	id_programador INT NOT NULL,
    nome VARCHAR(250),
    PRIMARY KEY (id_programador)
);

CREATE TABLE lider(
	id_lider INT NOT NULL,
    nome VARCHAR(250),
     PRIMARY KEY(id_lider)
);

CREATE TABLE projeto(
	id_projeto 	INT NOT NULL,
    descricao VARCHAR(250),
    data_cadastro DATE,
    id_lider INT NOT NULL,
	PRIMARY KEY(id_projeto),
    FOREIGN KEY (id_lider) REFERENCES lider(id_lider)
);

CREATE TABLE task_projeto(
	id_task INT NOT NULL,
    id_projeto INT NOT NULL,
    PRIMARY KEY(id_task, id_projeto),
    FOREIGN KEY (id_task) REFERENCES task(id_task),
    FOREIGN KEY (id_projeto) REFERENCES projeto(id_projeto)
);

CREATE TABLE task_programador(
	id_task INT NOT NULL,
    id_programador INT NOT NULL,
    PRIMARY KEY (id_task, id_programador),
    FOREIGN KEY (id_task) REFERENCES task(id_task),
    FOREIGN KEY (id_programador) REFERENCES programador(id_programador)
);