package com.Up2Play.backend;

import org.junit.platform.suite.api.SelectPackages;
import org.junit.platform.suite.api.Suite;
import org.junit.platform.suite.api.SuiteDisplayName;

@Suite
@SuiteDisplayName("Ejecución Integral de todos los Tests de Up2Play")
@SelectPackages("com.Up2Play.backend") // <--- ESTO ES LO IMPORTANTE
public class AllTestsSuite {
    /* Esta clase se deja vacía. 
       La anotación @SelectPackages buscará automáticamente TODO lo que 
       esté dentro de ese paquete y sus subcarpetas (incluyendo monkey).
    */
}