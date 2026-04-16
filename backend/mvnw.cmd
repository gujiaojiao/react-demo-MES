@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup batch script, version 3.2.0
@REM ----------------------------------------------------------------------------

@IF "%__MVNW_ARG0__%"=="" (SET __MVNW_ARG0__=%0)
@SET __MVNW_CMD__=
@SET __MVNW_ERROR__=
@SET __MVNW_PSMODULEP_SAVE=%PSModulePath%
@SET PSModulePath=
@FOR %%i IN (%*) DO @(
  IF "%%i"=="-Dmaven.multiModuleProjectDirectory=" (
    @SET __MVNW_MULTI_MODULE_PROJECT_DIR__=%%j
  )
)

@REM Find project base dir
@SET __MVNW_PROJECT_BASE_DIR__=%__MVNW_MULTI_MODULE_PROJECT_DIR__%
@IF NOT EXIST "%__MVNW_PROJECT_BASE_DIR__%\.mvn" (
  @FOR /F "usebackq tokens=*" %%i IN (`cd`) DO @(
    SET __MVNW_PROJECT_BASE_DIR__=%%i
  )
)

@REM Resolve MVNW_JAVA_HOME
@SET MVNW_JAVA_HOME=
@FOR /F "usebackq delims=" %%a IN (`findstr /B /C:"MVNW_JAVA_HOME=" "%__MVNW_PROJECT_BASE_DIR__%\.mvn\wrapper\maven-wrapper.properties" 2^>NUL`) DO @(
  @SET "%%a"
)
@IF NOT "%MVNW_JAVA_HOME%"=="" @GOTO :run

@REM Try to resolve JAVA_HOME from environment
@IF NOT "%JAVA_HOME%"=="" (
  @SET MVNW_JAVA_HOME=%JAVA_HOME%
  @GOTO :run
)

@REM Try to find Java from PATH
@FOR /F "tokens=1-3 delims=;" %%a IN ("%PATH%") DO @(
  @IF EXIST "%%a\java.exe" (
    @SET MVNW_JAVA_HOME=%%a
    @GOTO :run
  )
)

:run
@IF "%MVNW_JAVA_HOME%"=="" (
  @ECHO Cannot find Java executable
  @EXIT /B 1
)

@REM Execute Maven
@SET __MVNW_CMD__="%MVNW_JAVA_HOME%\bin\java.exe" -classpath "%__MVNW_PROJECT_BASE_DIR__%\.mvn\wrapper\maven-wrapper.jar" org.apache.maven.wrapper.MavenWrapperMain %*
@%__MVNW_CMD__%