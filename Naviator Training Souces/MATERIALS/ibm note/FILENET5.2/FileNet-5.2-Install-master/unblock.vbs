
' Licensed Materials - Property of IBM
' 5725A15, 5724R81
' (c) Copyright IBM Corp. 2010, 2011  All Rights Reserved.
' US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.

Option Explicit

Const ForReading = 1, ForWriting = 2

If WScript.Arguments.Count <> 1 Then
    WScript.Echo "Usage: unblock.vbs <file>"
    WScript.Quit
End If

Dim strFileName, strZoneIdentifier
strFileName = WScript.Arguments.Item(0)
strZoneIdentifier = strFileName & ":Zone.Identifier"

Dim objFSO, objFile, strContents
Set objFSO = CreateObject("Scripting.FileSystemObject")

If Not objFSO.FileExists(strZoneIdentifier) Then
    WScript.Echo "unblock.vbs: """ & strFileName & """ does not have a Zone Identifier"
    WScript.Quit
End If

Set objFile = objFSO.OpenTextFile(strZoneIdentifier, ForReading)
strContents = objFile.ReadAll
objFile.Close

Dim arrLines, strLine, objRegExp
Set objFile = objFSO.OpenTextFile(strZoneIdentifier, ForWriting)
arrLines = Split(strContents, vbCrLf)
For Each strLine in arrLines
    Set objRegExp = New RegExp
    With objRegExp
        .Pattern = "^ZoneId=(\d+)$"
        .IgnoreCase = False
        .Global = False
    End With
    strLine = objRegExp.Replace(strLine, "ZoneId=0")   Rem URLZONE_PREDEFINED_MIN
    objFile.WriteLine strLine
Next
objFile.Close

