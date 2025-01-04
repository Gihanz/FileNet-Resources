
' Licensed Materials - Property of IBM
' 5725A15, 5724R81
' (c) Copyright IBM Corp. 2010, 2011  All Rights Reserved.
' US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.

Option Explicit

If WScript.Arguments.Count < 3 Then
    WScript.Echo "Usage: cscript <scriptname>.vbs <Text file> <old Status> <New Status>"
    WScript.Quit
End If

Const FileRead = 1    
Const FileWrite = 2

Dim strFileName, strOldText, strNewText

strFileName = Wscript.Arguments(0)
strOldText = Wscript.Arguments(1)
strNewText = Wscript.Arguments(2)

Dim objTextFile, objFile, strTextBuffer

Set objTextFile = CreateObject("Scripting.FileSystemObject")
Set objFile = objTextFile.OpenTextFile(strFileName, FileRead ) 
strTextBuffer = objFile.ReadAll
objFile.Close

Dim strNewTextBuffer

strNewTextBuffer = Replace(strTextBuffer, strOldText, strNewText)
Set objFile = objTextFile.OpenTextFile(strFileName, FileWrite )
objFile.WriteLine strNewTextBuffer 
objFile.Close
