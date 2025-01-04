
' Licensed Materials - Property of IBM
' 5725A15, 5724R81
' (c) Copyright IBM Corp. 2010, 2011  All Rights Reserved.
' US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.


Option Explicit

If WScript.Arguments.Count < 2 Then
    WScript.Echo "Usage: cscript unzip.vbs <zip file> <destination directory>"
    WScript.Quit
End If

Dim strRelPathSrc, strRelPathDst
strRelPathSrc = WScript.Arguments.Item(0)
strRelPathDst = WScript.Arguments.Item(1)

Dim objFSO
Set objFSO = CreateObject("Scripting.FileSystemObject")

Dim strAbsPathSrc, strAbsPathDst
strAbsPathSrc = objFSO.GetAbsolutePathName(strRelPathSrc)
strAbsPathDst = objFSO.GetAbsolutePathName(strRelPathDst)

Dim objShell, objSrc, objDst
Set objShell = CreateObject("Shell.Application")
Set objSrc = objShell.NameSpace(strAbsPathSrc)
Set objDst = objShell.Namespace(strAbsPathDst)

objDst.CopyHere(objSrc.Items)

